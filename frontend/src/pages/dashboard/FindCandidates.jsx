import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, User, Briefcase, FileText, X, Mail, Link as LinkIcon, Download, ChevronRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { cn } from '../../lib/utils';

const FindCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/auth/seekers');
        setCandidates(res.data);
      } catch (error) {
        console.error('Error fetching candidates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (candidate.title && candidate.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (candidate.skills && candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 rounded-3xl glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-text">Find Candidates</h1>
          <p className="text-text-muted mt-2 text-lg">Discover top talent for your open roles.</p>
        </div>
        <div className="w-full sm:w-96 relative z-10">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            className="pl-11 h-12 rounded-xl border-border/50 bg-[hsl(var(--surface-hover)/0.5)] shadow-sm focus:bg-[hsl(var(--surface))]" 
            placeholder="Search by name, title, or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="animate-pulse h-48 border-none" />)}
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-20 bg-[hsl(var(--surface)/0.6)] rounded-3xl border border-border/50 border-dashed backdrop-blur-sm">
          <User className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-medium">No candidates found</h3>
          <p className="text-text-muted mt-2 text-lg">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <Card 
              key={candidate._id} 
              hoverEffect 
              className="border-none shadow-soft cursor-pointer group"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardContent className="p-6">
                <div className="flex gap-5 items-start mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary flex items-center justify-center font-bold text-xl uppercase flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">{candidate.name}</h3>
                    <p className="text-sm font-medium text-text-muted flex items-center gap-1.5 mt-1.5">
                      <Briefcase className="w-4 h-4" />
                      {candidate.title || 'Job Seeker'}
                    </p>
                  </div>
                </div>
                
                {candidate.bio && (
                  <p className="text-sm text-text-muted mb-5 line-clamp-2 leading-relaxed">{candidate.bio}</p>
                )}

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {candidate.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs py-0.5 px-2.5 font-medium bg-[hsl(var(--surface))]">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs py-0.5 px-2.5 font-medium bg-[hsl(var(--surface-hover))]">
                        +{candidate.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-border/50 mt-auto flex justify-between items-center text-sm font-semibold text-text-muted group-hover:text-primary transition-colors">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-border relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[hsl(var(--surface-hover))] transition-colors text-text-muted hover:text-text z-20 bg-surface/50 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 pb-6 bg-gradient-to-br from-primary/10 via-[hsl(var(--surface))] to-[hsl(var(--surface))] border-b border-border/50 relative overflow-hidden flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-4xl uppercase shadow-xl ring-4 ring-surface">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-heading font-bold text-text">{selectedCandidate.name}</h2>
                  <p className="text-lg text-primary font-medium mt-1">{selectedCandidate.title || 'Job Seeker'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* Contact Information Box */}
              <div className="bg-[hsl(var(--surface-hover))] rounded-2xl p-6 border border-border/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Direct Contact
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xl font-medium text-text select-all">{selectedCandidate.email}</div>
                  <Button asChild className="shadow-md shadow-primary/20 hover:shadow-primary/40 shrink-0">
                    <a href={`mailto:${selectedCandidate.email}`}>Send Email</a>
                  </Button>
                </div>
              </div>

              {selectedCandidate.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">About</h3>
                  <p className="text-text leading-relaxed">{selectedCandidate.bio}</p>
                </div>
              )}

              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-border/50 bg-[hsl(var(--surface-hover)/0.5)] flex justify-between items-center flex-shrink-0">
              {selectedCandidate.resume ? (
                <Button variant="outline" asChild>
                  <a href={selectedCandidate.resume} target="_blank" rel="noreferrer"><FileText className="w-4 h-4 mr-2" /> View Resume</a>
                </Button>
              ) : (
                <span className="text-sm text-text-muted italic">No resume uploaded</span>
              )}
              <Button variant="ghost" onClick={() => setSelectedCandidate(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindCandidates;
