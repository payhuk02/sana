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
import { useState } from 'react';
import { Upload, X, Palette } from 'lucide-react';
import { ColorPicker } from '@/components/admin/ColorPicker';
import { logger } from '@/lib/logger';

export default function SiteSettings() {
  const { settings, updateSettings } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Raleway', 'Nunito', 'Playfair Display', 'Merriweather', 
    'Source Sans Pro', 'Ubuntu', 'Oswald', 'Work Sans'
  ];

  const handleChange = (field: string, value: string) => {
    updateSettings({ [field]: value });
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

  const removeBanner = () => {
    handleChange('hero_image', '');
    setBannerPreview(null);
    toast.success('Image de bannière supprimée');
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

  const removeLogo = () => {
    handleChange('logo', '');
    setLogoPreview(null);
    toast.success('Logo supprimé');
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
          <TabsTrigger value="general" className="text-xs sm:text-sm">Général</TabsTrigger>
          <TabsTrigger value="homepage" className="text-xs sm:text-sm">Accueil</TabsTrigger>
          <TabsTrigger value="design" className="text-xs sm:text-sm">Design</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">À propos</TabsTrigger>
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
