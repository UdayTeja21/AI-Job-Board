import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Building2, Globe, MapPin, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const RecruiterCompany = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [company, setCompany] = useState({
    name: '',
    website: '',
    location: '',
    description: '',
    companySize: '1-10 employees',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/companies/my');
        if (res.data) {
          setCompany({
            name: res.data.name || '',
            website: res.data.website || '',
            location: res.data.location || '',
            description: res.data.description || '',
            companySize: res.data.companySize || '1-10 employees',
          });
        }
      } catch (error) {
        // If 404, they just haven't created one yet
        if (error.response && error.response.status !== 404) {
          toast.error('Failed to load company profile');
        }
      } finally {
        setFetching(false);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/companies/my', company);
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center"><div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Company Profile</h1>
        <p className="text-text-muted mt-1">Manage your organization's public profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-border flex items-center justify-center text-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs font-medium">Upload Logo</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-text">Company Logo</h3>
                <p className="text-sm text-text-muted">Recommended size: 400x400px.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Company Name</label>
                <Input name="name" value={company.name} onChange={handleChange} required placeholder="Tech Innovators Inc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><Globe className="h-4 w-4 text-text-muted" /> Website</label>
                <Input name="website" value={company.website} onChange={handleChange} placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><Users className="h-4 w-4 text-text-muted" /> Company Size</label>
                <select 
                  name="companySize"
                  value={company.companySize}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="500+ employees">500+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text flex items-center gap-2"><MapPin className="h-4 w-4 text-text-muted" /> Headquarters</label>
                <Input name="location" value={company.location} onChange={handleChange} required placeholder="San Francisco, CA" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Company Description</label>
              <textarea 
                name="description"
                value={company.description}
                onChange={handleChange}
                required
                className="w-full min-h-[120px] rounded-lg border border-border bg-surface px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Tell candidates what your company is all about..."
              ></textarea>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border mt-4 pt-6">
          <Button form="company-form" type="submit" isLoading={loading}>Save Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecruiterCompany;
