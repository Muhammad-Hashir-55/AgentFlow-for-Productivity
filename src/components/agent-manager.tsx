'use client';

import { useState } from 'react';
import { useAgents } from '@/hooks/use-agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, Plus, Search, Trash2 } from 'lucide-react';

export function AgentManager() {
  const { agents, addAgent, deleteAgent } = useAgents();
  const { toast } = useToast();

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl || !newDesc) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    try {
      new URL(newUrl);
    } catch (_) {
      toast({ title: 'Invalid URL format', variant: 'destructive' });
      return;
    }
    addAgent(newName, newUrl, newDesc);
    setNewName('');
    setNewUrl('');
    setNewDesc('');
    toast({ title: 'Agent added successfully' });
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const query = encodeURIComponent(`site:agent.ai ${searchTerm}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search for Agents</CardTitle>
          <CardDescription>
            Find new agents on Agent.ai to add to your personalized list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., 'video generator'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add a Custom Agent</CardTitle>
          <CardDescription>Manually add an agent by providing its details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAgent} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input id="agent-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="My Custom Agent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-url">URL</Label>
                <Input id="agent-url" type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-desc">Description</Label>
              <Input id="agent-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What this agent does." />
            </div>
            <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add Agent</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Agent List</h2>
        <Separator />
        <div className="space-y-4">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <Card key={agent.id} className="flex flex-col sm:flex-row items-start justify-between p-4">
                <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                   <Button size="sm" variant="link" asChild className="p-0 h-auto">
                      <a href={agent.url} target="_blank" rel="noopener noreferrer" className="text-sm">
                        {agent.url} <ArrowUpRight className="inline-block ml-1 h-3 w-3" />
                      </a>
                    </Button>
                </div>
                <Button variant="destructive" size="icon" onClick={() => deleteAgent(agent.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Agent</span>
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">You haven't added any agents yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
