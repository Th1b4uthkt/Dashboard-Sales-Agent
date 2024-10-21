import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import { Call } from '@/types/retell';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

interface CallHistoryListProps {
  calls: Call[];
}

export function CallHistoryList({ calls }: CallHistoryListProps) {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  if (calls.length === 0) {
    return <div>No call history available.</div>;
  }

  function formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Agent ID</TableHead>
              <TableHead>Call Type</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Successful</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">{call.id}</TableCell>
                <TableCell>{call.agent_id}</TableCell>
                <TableCell>{call.call_type}</TableCell>
                <TableCell>{new Date(call.start_time).toLocaleString()}</TableCell>
                <TableCell>{formatDuration(call.duration)}</TableCell>
                <TableCell>{call.status}</TableCell>
                <TableCell>{call.call_analysis?.user_sentiment || 'N/A'}</TableCell>
                <TableCell>{call.call_analysis?.call_successful ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCall(call)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Call Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about the selected call.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedCall && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium">Call ID</h4>
                            <p className="mt-1 text-sm">{selectedCall.id}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Agent ID</h4>
                            <p className="mt-1 text-sm">{selectedCall.agent_id}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Call Type</h4>
                            <p className="mt-1 text-sm">{selectedCall.call_type}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Call Time</h4>
                            <p className="mt-1 text-sm">Start: {new Date(selectedCall.start_time).toLocaleString()}</p>
                            <p className="mt-1 text-sm">End: {new Date(selectedCall.end_time).toLocaleString()}</p>
                            <p className="mt-1 text-sm">Duration: {formatDuration(selectedCall.duration)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Status</h4>
                            <p className="mt-1 text-sm">{selectedCall.status}</p>
                          </div>
                          {selectedCall.call_analysis && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium">Call Summary</h4>
                                <p className="mt-1 text-sm">{selectedCall.call_analysis.call_summary || 'No summary available.'}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Call Analysis</h4>
                                <p className="mt-1 text-sm">Sentiment: {selectedCall.call_analysis.user_sentiment || 'N/A'}</p>
                                <p className="mt-1 text-sm">Successful: {selectedCall.call_analysis.call_successful ? 'Yes' : 'No'}</p>
                                <p className="mt-1 text-sm">In Voicemail: {selectedCall.call_analysis.in_voicemail ? 'Yes' : 'No'}</p>
                              </div>
                            </>
                          )}
                          <div>
                            <h4 className="text-sm font-medium">Transcript</h4>
                            <pre className="mt-1 text-sm whitespace-pre-wrap overflow-auto max-h-40">
                              {selectedCall.transcript}
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Recording</h4>
                            <audio controls src={selectedCall.recording_url} className="mt-1">
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
