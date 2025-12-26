-- Add table for storing attendee information for each ticket
CREATE TABLE IF NOT EXISTS ticket_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ticket_attendees_ticket_id ON ticket_attendees(ticket_id);

-- Enable Row Level Security
ALTER TABLE ticket_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ticket_attendees table
CREATE POLICY "Users can view attendees for their tickets"
  ON ticket_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_attendees.ticket_id 
      AND tickets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert attendees for their tickets"
  ON ticket_attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.id = ticket_attendees.ticket_id 
      AND tickets.user_id::text = auth.uid()::text
    )
  );
