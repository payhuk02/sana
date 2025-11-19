import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Upload, X, Palette, Plus, Minus } from 'lucide-react';
import { ColorPicker } from '@/components/admin/ColorPicker';
import { logger } from '@/lib/logger';

export default function SiteSettings() {
  const { settings, updateSettings } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Synchroniser les previews avec les settings au chargement
  useEffect(() => {
    if (settings.hero_image && !bannerPreview) {
      setBannerPreview(settings.hero_image);
    }
    if (settings.logo && !logoPreview) {
      setLogoPreview(settings.logo);
    }
  }, [settings.hero_image, settings.logo, bannerPreview, logoPreview]);

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Raleway', 'Nunito', 'Playfair Display', 'Merriweather', 
    'Source Sans Pro', 'Ubuntu', 'Oswald', 'Work Sans'
  ];

  const handleChange = async (field: string, value: string | Array<{ question: string; answer: string }>) => {
    try {
      // Handle faq_content specially - it can be a JSON string or array
      if (field === 'faq_content') {
        const faqValue = typeof value === 'string' ? JSON.parse(value) : value;
        await updateSettings({ [field]: faqValue });
      } else {
        await updateSettings({ [field]: value });
      }
    } catch (error) {
      logger.error(`Error updating ${field}`, error, 'SiteSettings');
      toast.error(`Erreur lors de la mise à jour de ${field}`);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('banner-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banner-images')
        .getPublicUrl(fileName);

      // Update settings with new image URL
      handleChange('hero_image', publicUrl);
      setBannerPreview(publicUrl);
      toast.success('Image uploadée avec succès');
    } catch (error) {
      logger.error('Error uploading banner image', error, 'SiteSettings');
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const removeBanner = async () => {
    try {
      await handleChange('hero_image', '');
      setBannerPreview(null);
      toast.success('Image de bannière supprimée');
    } catch (error) {
      // Error already handled in handleChange
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Le logo ne doit pas dépasser 2 MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('logo-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('logo-images')
        .getPublicUrl(fileName);

      handleChange('logo', publicUrl);
      setLogoPreview(publicUrl);
      toast.success('Logo uploadé avec succès');
    } catch (error) {
      logger.error('Error uploading logo image', error, 'SiteSettings');
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    try {
      await handleChange('logo', '');
      setLogoPreview(null);
      toast.success('Logo supprimé');
    } catch (error) {
      // Error already handled in handleChange
    }
  };

  const handleSave = () => {
    toast.success('Paramètres enregistrés avec succès');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Paramètres du Site</h1>
        <p className="text-muted-foreground mt-2">Personnalisez votre site e-commerce</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="general" className="text-xs sm:text-sm">Général</TabsTrigger>
          <TabsTrigger value="homepage" className="text-xs sm:text-sm">Accueil</TabsTrigger>
          <TabsTrigger value="design" className="text-xs sm:text-sm">Design</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">À propos</TabsTrigger>
          <TabsTrigger value="legal" className="text-xs sm:text-sm">Légal</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Configurez les informations de base de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan</Label>
                <Input
                  id="slogan"
                  value={settings.slogan}
                  onChange={(e) => handleChange('slogan', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bannière Hero</CardTitle>
              <CardDescription>Personnalisez la bannière principale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Titre principal</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Sous-titre</Label>
                <Input
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage">Image de la bannière</Label>
                {(bannerPreview || settings.hero_image) ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border">
                      <img
                        src={bannerPreview || settings.hero_image}
                        alt="Aperçu de la bannière"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeBanner}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                      disabled={uploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Upload en cours...' : 'Changer l\'image'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Aucune image sélectionnée
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Upload en cours...' : 'Choisir une image'}
                    </Button>
                  </div>
                )}
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Recommandé : 1920x820px, max 5 MB
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques Hero Banner</CardTitle>
              <CardDescription>Configurez les statistiques affichées dans le Hero Banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.homepage_stats || []).map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`stat-value-${index}`}>Valeur {index + 1}</Label>
                        <Input
                          id={`stat-value-${index}`}
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...(settings.homepage_stats || [])];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            handleChange('homepage_stats', newStats);
                          }}
                          placeholder="1000+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stat-label-${index}`}>Label {index + 1}</Label>
                        <Input
                          id={`stat-label-${index}`}
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...(settings.homepage_stats || [])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            handleChange('homepage_stats', newStats);
                          }}
                          placeholder="Produits"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newStats = [...(settings.homepage_stats || [])];
                        newStats.splice(index, 1);
                        handleChange('homepage_stats', newStats);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newStats = [...(settings.homepage_stats || []), { value: '', label: '' }];
                    handleChange('homepage_stats', newStats);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une statistique
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features (Avantages)</CardTitle>
              <CardDescription>Configurez les features affichées sur la page d'accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.features_content || []).map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`feature-icon-${index}`}>Icône {index + 1}</Label>
                      <Select
                        value={feature.icon}
                        onValueChange={(value) => {
                          const newFeatures = [...(settings.features_content || [])];
                          newFeatures[index] = { ...newFeatures[index], icon: value };
                          handleChange('features_content', newFeatures);
                        }}
                      >
                        <SelectTrigger id={`feature-icon-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TruckIcon">Livraison (TruckIcon)</SelectItem>
                          <SelectItem value="ShieldCheck">Sécurité (ShieldCheck)</SelectItem>
                          <SelectItem value="HeadphonesIcon">Support (HeadphonesIcon)</SelectItem>
                          <SelectItem value="Star">Étoile (Star)</SelectItem>
                          <SelectItem value="Target">Cible (Target)</SelectItem>
                          <SelectItem value="Users">Utilisateurs (Users)</SelectItem>
                          <SelectItem value="Award">Récompense (Award)</SelectItem>
                          <SelectItem value="TrendingUp">Tendance (TrendingUp)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`feature-title-${index}`}>Titre {index + 1}</Label>
                      <Input
                        id={`feature-title-${index}`}
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...(settings.features_content || [])];
                          newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                          handleChange('features_content', newFeatures);
                        }}
                        placeholder="Livraison rapide"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`feature-desc-${index}`}>Description {index + 1}</Label>
                      <Input
                        id={`feature-desc-${index}`}
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...(settings.features_content || [])];
                          newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                          handleChange('features_content', newFeatures);
                        }}
                        placeholder="Sous 48h"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newFeatures = [...(settings.features_content || [])];
                        newFeatures.splice(index, 1);
                        handleChange('features_content', newFeatures);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFeatures = [...(settings.features_content || []), { icon: 'Star', title: '', description: '' }];
                    handleChange('features_content', newFeatures);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une feature
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Titres des Sections</CardTitle>
              <CardDescription>Configurez les titres et descriptions des sections de la page d'accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['categories', 'featured', 'new', 'promo', 'testimonials'].map((sectionKey) => (
                <div key={sectionKey} className="space-y-3 border rounded-lg p-4">
                  <h4 className="font-semibold capitalize">{sectionKey === 'featured' ? 'Produits Populaires' : sectionKey === 'new' ? 'Nouveautés' : sectionKey === 'promo' ? 'Promotions' : sectionKey === 'testimonials' ? 'Avis Clients' : 'Catégories'}</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`section-title-${sectionKey}`}>Titre</Label>
                    <Input
                      id={`section-title-${sectionKey}`}
                      value={settings.homepage_sections?.[sectionKey as keyof typeof settings.homepage_sections]?.title || ''}
                      onChange={(e) => {
                        const newSections = {
                          ...(settings.homepage_sections || {}),
                          [sectionKey]: {
                            ...(settings.homepage_sections?.[sectionKey as keyof typeof settings.homepage_sections] || {}),
                            title: e.target.value,
                          },
                        };
                        handleChange('homepage_sections', newSections);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`section-desc-${sectionKey}`}>Description</Label>
                    <Input
                      id={`section-desc-${sectionKey}`}
                      value={settings.homepage_sections?.[sectionKey as keyof typeof settings.homepage_sections]?.description || ''}
                      onChange={(e) => {
                        const newSections = {
                          ...(settings.homepage_sections || {}),
                          [sectionKey]: {
                            ...(settings.homepage_sections?.[sectionKey as keyof typeof settings.homepage_sections] || {}),
                            description: e.target.value,
                          },
                        };
                        handleChange('homepage_sections', newSections);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Témoignages Clients</CardTitle>
              <CardDescription>Gérez les témoignages affichés sur la page d'accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.testimonials_content || []).map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-name-${index}`}>Nom {index + 1}</Label>
                      <Input
                        id={`testimonial-name-${index}`}
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...(settings.testimonials_content || [])];
                          newTestimonials[index] = { ...newTestimonials[index], name: e.target.value };
                          handleChange('testimonials_content', newTestimonials);
                        }}
                        placeholder="Sophie Martin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-text-${index}`}>Texte {index + 1}</Label>
                      <Textarea
                        id={`testimonial-text-${index}`}
                        value={testimonial.text}
                        onChange={(e) => {
                          const newTestimonials = [...(settings.testimonials_content || [])];
                          newTestimonials[index] = { ...newTestimonials[index], text: e.target.value };
                          handleChange('testimonials_content', newTestimonials);
                        }}
                        rows={3}
                        placeholder="Excellent service et produits de qualité..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-rating-${index}`}>Note {index + 1} (1-5)</Label>
                      <Input
                        id={`testimonial-rating-${index}`}
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating}
                        onChange={(e) => {
                          const newTestimonials = [...(settings.testimonials_content || [])];
                          newTestimonials[index] = { ...newTestimonials[index], rating: parseInt(e.target.value) || 5 };
                          handleChange('testimonials_content', newTestimonials);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newTestimonials = [...(settings.testimonials_content || [])];
                        newTestimonials.splice(index, 1);
                        handleChange('testimonials_content', newTestimonials);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newTestimonials = [...(settings.testimonials_content || []), { name: '', text: '', rating: 5 }];
                    handleChange('testimonials_content', newTestimonials);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un témoignage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Logo du site
              </CardTitle>
              <CardDescription>Uploadez le logo de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(logoPreview || settings.logo) && (
                <div className="relative inline-block">
                  <img
                    src={logoPreview || settings.logo}
                    alt="Logo"
                    className="h-20 w-auto object-contain border border-border rounded-lg p-2 bg-background"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading}
                />
                <Button
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={uploading}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Upload en cours...' : 'Uploader un logo'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Format PNG ou SVG recommandé, max 2 MB
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Couleurs du thème</CardTitle>
              <CardDescription>Personnalisez les couleurs de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPicker
                label="Couleur primaire"
                value={settings.primary_color}
                onChange={(value) => handleChange('primary_color', value)}
                description="Utilisée pour les boutons principaux et liens"
              />
              <ColorPicker
                label="Couleur secondaire"
                value={settings.secondary_color}
                onChange={(value) => handleChange('secondary_color', value)}
                description="Utilisée pour les éléments secondaires"
              />
              <ColorPicker
                label="Couleur accent"
                value={settings.accent_color}
                onChange={(value) => handleChange('accent_color', value)}
                description="Utilisée pour mettre en avant certains éléments"
              />
              <ColorPicker
                label="Couleur de fond"
                value={settings.background_color}
                onChange={(value) => handleChange('background_color', value)}
                description="Couleur de fond principale du site"
              />
              <ColorPicker
                label="Couleur du texte"
                value={settings.foreground_color}
                onChange={(value) => handleChange('foreground_color', value)}
                description="Couleur du texte principal"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Polices de caractères</CardTitle>
              <CardDescription>Choisissez les polices pour votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-font">Police principale</Label>
                <Select
                  value={settings.primary_font}
                  onValueChange={(value) => handleChange('primary_font', value)}
                >
                  <SelectTrigger id="primary-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Utilisée pour le texte courant
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading-font">Police des titres</Label>
                <Select
                  value={settings.heading_font}
                  onValueChange={(value) => handleChange('heading_font', value)}
                >
                  <SelectTrigger id="heading-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map((font) => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Utilisée pour les titres et en-têtes
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <p className="text-sm font-semibold mb-2">Aperçu:</p>
                <h3 style={{ fontFamily: settings.heading_font }} className="text-2xl font-bold mb-2">
                  Titre de démonstration
                </h3>
                <p style={{ fontFamily: settings.primary_font }} className="text-base">
                  Ceci est un exemple de texte avec votre police principale. 
                  Les modifications seront appliquées en temps réel sur tout le site.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Configurez vos coordonnées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (pour contact produits)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+212 6 12 34 56 78"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Numéro WhatsApp utilisé pour le bouton "Contacter" sur les cartes produits
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page À propos</CardTitle>
              <CardDescription>Personnalisez votre présentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutText">Texte de présentation</Label>
                <Textarea
                  id="aboutText"
                  value={settings.aboutText}
                  onChange={(e) => handleChange('aboutText', e.target.value)}
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_hero_description">Description Hero</Label>
                <Input
                  id="about_hero_description"
                  value={settings.about_hero_description || ''}
                  onChange={(e) => handleChange('about_hero_description', e.target.value)}
                  placeholder="Votre partenaire de confiance..."
                />
                <p className="text-xs text-muted-foreground">
                  Description affichée dans le hero de la page À propos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valeurs de l'entreprise</CardTitle>
              <CardDescription>Configurez les valeurs affichées sur la page À propos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.about_values || []).map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`value-icon-${index}`}>Icône {index + 1}</Label>
                      <Select
                        value={value.icon}
                        onValueChange={(iconValue) => {
                          const newValues = [...(settings.about_values || [])];
                          newValues[index] = { ...newValues[index], icon: iconValue };
                          handleChange('about_values', newValues);
                        }}
                      >
                        <SelectTrigger id={`value-icon-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Target">Cible (Target)</SelectItem>
                          <SelectItem value="Users">Utilisateurs (Users)</SelectItem>
                          <SelectItem value="Award">Récompense (Award)</SelectItem>
                          <SelectItem value="TrendingUp">Tendance (TrendingUp)</SelectItem>
                          <SelectItem value="TruckIcon">Livraison (TruckIcon)</SelectItem>
                          <SelectItem value="ShieldCheck">Sécurité (ShieldCheck)</SelectItem>
                          <SelectItem value="HeadphonesIcon">Support (HeadphonesIcon)</SelectItem>
                          <SelectItem value="Star">Étoile (Star)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`value-title-${index}`}>Titre {index + 1}</Label>
                      <Input
                        id={`value-title-${index}`}
                        value={value.title}
                        onChange={(e) => {
                          const newValues = [...(settings.about_values || [])];
                          newValues[index] = { ...newValues[index], title: e.target.value };
                          handleChange('about_values', newValues);
                        }}
                        placeholder="Excellence"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`value-desc-${index}`}>Description {index + 1}</Label>
                      <Textarea
                        id={`value-desc-${index}`}
                        value={value.description}
                        onChange={(e) => {
                          const newValues = [...(settings.about_values || [])];
                          newValues[index] = { ...newValues[index], description: e.target.value };
                          handleChange('about_values', newValues);
                        }}
                        rows={2}
                        placeholder="Nous sélectionnons uniquement les meilleurs produits..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newValues = [...(settings.about_values || [])];
                        newValues.splice(index, 1);
                        handleChange('about_values', newValues);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newValues = [...(settings.about_values || []), { icon: 'Target', title: '', description: '' }];
                    handleChange('about_values', newValues);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une valeur
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Configurez les statistiques affichées sur la page À propos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.about_stats || []).map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`about-stat-value-${index}`}>Valeur {index + 1}</Label>
                        <Input
                          id={`about-stat-value-${index}`}
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...(settings.about_stats || [])];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            handleChange('about_stats', newStats);
                          }}
                          placeholder="10K+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`about-stat-label-${index}`}>Label {index + 1}</Label>
                        <Input
                          id={`about-stat-label-${index}`}
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...(settings.about_stats || [])];
                            newStats[index] = { ...newStats[index], label: e.target.value };
                            handleChange('about_stats', newStats);
                          }}
                          placeholder="Clients satisfaits"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newStats = [...(settings.about_stats || [])];
                        newStats.splice(index, 1);
                        handleChange('about_stats', newStats);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newStats = [...(settings.about_stats || []), { value: '', label: '' }];
                    handleChange('about_stats', newStats);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une statistique
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Texte Équipe</CardTitle>
              <CardDescription>Texte de présentation de l'équipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_team_text">Texte de l'équipe</Label>
                <Textarea
                  id="about_team_text"
                  value={settings.about_team_text || ''}
                  onChange={(e) => handleChange('about_team_text', e.target.value)}
                  rows={4}
                  placeholder="Notre équipe de professionnels..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Texte d'Engagement</CardTitle>
              <CardDescription>Texte d'engagement de l'entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_commitment_text">Texte d'engagement</Label>
                <Textarea
                  id="about_commitment_text"
                  value={settings.about_commitment_text || ''}
                  onChange={(e) => handleChange('about_commitment_text', e.target.value)}
                  rows={4}
                  placeholder="Chez Sana Distribution, nous nous engageons..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Politique de confidentialité</CardTitle>
              <CardDescription>Gérez le contenu de votre politique de confidentialité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacy_policy">Contenu de la politique de confidentialité</Label>
                <Textarea
                  id="privacy_policy"
                  value={settings.privacy_policy}
                  onChange={(e) => handleChange('privacy_policy', e.target.value)}
                  rows={12}
                  placeholder="Entrez le contenu de votre politique de confidentialité..."
                />
                <p className="text-xs text-muted-foreground">
                  Ce contenu sera affiché sur la page /privacy
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentions légales</CardTitle>
              <CardDescription>Gérez le contenu de vos mentions légales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legal_notices">Contenu des mentions légales</Label>
                <Textarea
                  id="legal_notices"
                  value={settings.legal_notices}
                  onChange={(e) => handleChange('legal_notices', e.target.value)}
                  rows={12}
                  placeholder="Entrez le contenu de vos mentions légales..."
                />
                <p className="text-xs text-muted-foreground">
                  Ce contenu sera affiché sur la page /legal
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditions Générales de Vente (CGV)</CardTitle>
              <CardDescription>Gérez le contenu de vos CGV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms_of_sale">Contenu des CGV</Label>
                <Textarea
                  id="terms_of_sale"
                  value={settings.terms_of_sale}
                  onChange={(e) => handleChange('terms_of_sale', e.target.value)}
                  rows={12}
                  placeholder="Entrez le contenu de vos conditions générales de vente..."
                />
                <p className="text-xs text-muted-foreground">
                  Ce contenu sera affiché sur la page /terms
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture</CardTitle>
              <CardDescription>Configurez les horaires affichés sur la page contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="opening_hours">Horaires d'ouverture</Label>
                <Textarea
                  id="opening_hours"
                  value={settings.opening_hours}
                  onChange={(e) => handleChange('opening_hours', e.target.value)}
                  rows={4}
                  placeholder="Lundi - Vendredi: 9h - 18h&#10;Samedi: 10h - 16h&#10;Dimanche: Fermé"
                />
                <p className="text-xs text-muted-foreground">
                  Utilisez des retours à la ligne pour séparer les jours. Ce contenu sera affiché sur la page contact.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes (FAQ)</CardTitle>
              <CardDescription>Gérez les questions fréquentes affichées sur la page contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(settings.faq_content || []).map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`faq-q-${index}`}>Question {index + 1}</Label>
                      <Input
                        id={`faq-q-${index}`}
                        value={faq.question}
                        onChange={(e) => {
                          const newFaq = [...(settings.faq_content || [])];
                          newFaq[index] = { ...newFaq[index], question: e.target.value };
                          handleChange('faq_content', newFaq);
                        }}
                        placeholder="Quelle est votre question ?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`faq-a-${index}`}>Réponse {index + 1}</Label>
                      <Textarea
                        id={`faq-a-${index}`}
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaq = [...(settings.faq_content || [])];
                          newFaq[index] = { ...newFaq[index], answer: e.target.value };
                          handleChange('faq_content', newFaq);
                        }}
                        rows={3}
                        placeholder="Entrez la réponse..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newFaq = [...(settings.faq_content || [])];
                        newFaq.splice(index, 1);
                        handleChange('faq_content', newFaq);
                      }}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFaq = [...(settings.faq_content || []), { question: '', answer: '' }];
                    handleChange('faq_content', newFaq);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
