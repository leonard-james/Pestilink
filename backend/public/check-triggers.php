<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Set up database connection
$config = $app['config']->get('database.connections.mysql');

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};",
        $config['username'],
        $config['password']
    );
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check triggers
    $stmt = $pdo->query("SHOW TRIGGERS");
    $triggers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($triggers)) {
        echo "No triggers found in the database.\n";
        
        // Check if the migration was run
        $migration = '2025_12_06_075854_create_database_triggers';
        $stmt = $pdo->query("SELECT * FROM migrations WHERE migration = '$migration'");
        $migrationRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($migrationRecord) {
            echo "Migration $migration was run in batch {$migrationRecord['batch']}.\n";
            echo "But no triggers were created. This suggests the migration might have failed.\n";
            
            // Let's try to run the migration again
            echo "Attempting to run the migration again...\n";
            
            // Get the migration file path
            $migrationFile = __DIR__ . '/../database/migrations/' . $migration . '.php';
            
            if (file_exists($migrationFile)) {
                require_once $migrationFile;
                
                $className = 'CreateDatabaseTriggers';
                $migration = new $className();
                $migration->up();
                
                echo "Migration re-run. Checking triggers again...\n";
                
                $stmt = $pdo->query("SHOW TRIGGERS");
                $triggers = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                if (empty($triggers)) {
                    echo "Still no triggers found. There might be an error in the migration file.\n";
                } else {
                    echo "Success! Found the following triggers:\n";
                    print_r($triggers);
                }
            } else {
                echo "Could not find migration file: $migrationFile\n";
            }
        } else {
            echo "The migration $migration was not found in the migrations table.\n";
        }
    } else {
        echo "Found the following triggers:\n";
        print_r($triggers);
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    echo "Make sure your database is running and the .env file is properly configured.\n";
}

echo "\nTo test the triggers, you can run the following commands in your database:\n";
echo "1. To test user creation logging: INSERT INTO users (name, email, password, role) VALUES ('Test User', 'test@example.com', 'hashed_password', 'user');\n";
echo "2. To test admin deletion prevention: DELETE FROM users WHERE role = 'admin'; (should fail)\n";

echo "\nCheck the system_logs table after running these commands to see if the triggers are working.\n";

$response->send();

$kernel->terminate($request, $response);
