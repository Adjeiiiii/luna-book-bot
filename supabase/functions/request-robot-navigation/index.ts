import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { bookId, studentName } = await req.json();

    if (!bookId || !studentName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: bookId and studentName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      console.error('Error fetching book:', bookError);
      return new Response(
        JSON.stringify({ error: 'Book not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create robot task
    const { data: robotTask, error: taskError } = await supabase
      .from('robot_tasks')
      .insert({
        task_type: 'navigation_assist',
        book_id: bookId,
        student_name: studentName,
        status: 'pending',
        priority: 1,
        notes: `Navigate student to ${book.shelf_location} for "${book.title}"`
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating robot task:', taskError);
      return new Response(
        JSON.stringify({ error: 'Failed to create robot task' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create book request
    const { data: bookRequest, error: requestError } = await supabase
      .from('book_requests')
      .insert({
        book_id: bookId,
        student_name: studentName,
        request_type: 'navigation_assist',
        status: 'pending',
        robot_task_id: robotTask.id
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating book request:', requestError);
      return new Response(
        JSON.stringify({ error: 'Failed to create book request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Navigation request created:', {
      robotTaskId: robotTask.id,
      bookRequestId: bookRequest.id,
      book: book.title,
      location: book.shelf_location
    });

    return new Response(
      JSON.stringify({
        success: true,
        robotTask,
        bookRequest,
        message: `LUNA will guide you to ${book.shelf_location}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in request-robot-navigation:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});