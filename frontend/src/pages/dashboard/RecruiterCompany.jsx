import React, { useState, useEffect, useRef } from 'react';
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
    logo: 'no-photo.jpg',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

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
            logo: res.data.logo || 'no-photo.jpg',
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    try {
      const res = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCompany(prev => ({ ...prev, logo: res.data.imageUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingImage(false);
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
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-border flex items-center justify-center text-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer overflow-hidden relative group"
              >
                {uploadingImage ? (
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                ) : company.logo && company.logo !== 'no-photo.jpg' ? (
                  <>
                    <img src={company.logo.startsWith('http') ? company.logo : `http://localhost:5000${company.logo}`} alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-xs font-medium text-white">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Building2 className="h-8 w-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs font-medium">Upload Logo</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              
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
