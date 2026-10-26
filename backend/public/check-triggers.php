<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$connection = $app->make('db')->connection();
$driver = $connection->getDriverName();

try {
    $triggers = match ($driver) {
        'mysql', 'mariadb' => $connection->select('SHOW TRIGGERS'),
        'pgsql' => $connection->select("
            SELECT
                t.tgname AS \"Trigger\",
                pg_get_triggerdef(t.oid) AS \"Event\",
                c.relname AS \"Table\",
                CASE WHEN (t.tgtype & 2) = 2 THEN 'BEFORE' ELSE 'AFTER' END AS \"Timing\"
            FROM pg_trigger t
            JOIN pg_class c ON c.oid = t.tgrelid
            WHERE NOT t.tgisinternal
        "),
        default => [],
    };

    if (empty($triggers)) {
        echo "No triggers found for the configured database driver.\n";
    } else {
        echo "Found the following triggers:\n";
        print_r($triggers);
    }
} catch (\Illuminate\Database\QueryException|\PDOException $exception) {
    http_response_code(500);
    echo "Database error: " . $exception->getMessage() . "\n";
}

echo "\nTo test the triggers, you can run the following commands in your database:\n";
echo "1. To test user creation logging: INSERT INTO users (name, email, password, role) VALUES ('Test User', 'test@example.com', 'hashed_password', 'user');\n";
echo "2. To test admin deletion prevention: DELETE FROM users WHERE role = 'admin'; (should fail)\n";

echo "\nCheck the system_logs table after running these commands to see if the triggers are working.\n";

$response->send();

$kernel->terminate($request, $response);
