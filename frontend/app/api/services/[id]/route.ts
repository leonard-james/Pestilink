import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // Properly await the params
  const { id } = await Promise.resolve(context.params);
  // Log detailed request information
  console.log('\n--- New Request ---');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('--- Service Details API Route ---');
  console.log('Request URL:', request.url);
  console.log('Params:', { id });
  
  try {
    console.log('\n--- Request Params ---');
    console.log('Raw params:', { id });
    console.log('Extracted ID:', id, '(Type:', typeof id, ')');
    
    // Log the full URL being constructed
    const url = new URL(request.url || '', 'http://localhost:3000');
    console.log('Path segments:', url.pathname.split('/'));
    
    if (!id || id === 'undefined') {
      console.error('Error: No ID provided in params');
      return NextResponse.json(
        { error: 'Service ID is required', receivedId: id },
        { status: 400 }
      );
    }
    
    console.log('Fetching service details for ID:', id);
    
    // Mock data for demonstration
    const mockService = {
      id: parseInt(id, 10),
      title: `Service ${id}`,
      description: `This is a sample service with ID ${id}`,
      price: 99.99,
      company_name: 'Pest Control Inc.',
      location: 'Manila, Philippines',
      phone: '+63 2 1234 5678',
      email: 'contact@pestcontrol.com',
      image: null,
      pest_types: ['Cockroaches', 'Rats', 'Termites'],
      service_type: 'Residential'
    };
    
    console.log('Returning mock service data');
    return NextResponse.json(mockService);
  } catch (err) {
    const error = err as Error & {
      response?: {
        status: number;
        statusText: string;
        data: any;
      };
    };
    
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        responseData: error.response.data
      } : {})
    };
    
    console.error('Error in API route:', errorInfo);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch service details',
        details: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
