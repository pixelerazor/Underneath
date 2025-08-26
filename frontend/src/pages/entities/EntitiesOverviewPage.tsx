import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Brain, 
  Lock, 
  Lightbulb, 
  AlertTriangle, 
  AlertCircle,
  Crown,
  Zap,
  FileText
} from 'lucide-react';

// Import services
import { faqService, FAQ } from '../../services/faqService';
import { geistService, WellbeingEntry } from '../../services/geistService';
import { keuschheitService, ChastityEntry } from '../../services/keuschheitService';
import { erkenntnisseService, InsightEntry } from '../../services/erkenntnisseService';
import { rueckfallService, RelapseEntry } from '../../services/rueckfallService';
import { strafenService, PunishmentEntry } from '../../services/strafenService';
import { tpeService, TPEEntry } from '../../services/tpeService';
import { triggerService, TriggerEntry } from '../../services/triggerService';
import { allgemeineInformationenService, InformationEntry } from '../../services/allgemeineInformationenService';
import { toast } from 'sonner';

const EntitiesOverviewPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [wellbeing, setWellbeing] = useState<WellbeingEntry[]>([]);
  const [chastity, setChastity] = useState<ChastityEntry[]>([]);
  const [insights, setInsights] = useState<InsightEntry[]>([]);
  const [relapses, setRelapses] = useState<RelapseEntry[]>([]);
  const [punishments, setPunishments] = useState<PunishmentEntry[]>([]);
  const [tpeEntries, setTpeEntries] = useState<TPEEntry[]>([]);
  const [triggers, setTriggers] = useState<TriggerEntry[]>([]);
  const [information, setInformation] = useState<InformationEntry[]>([]);
  
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [
        faqData,
        wellbeingData,
        chastityData,
        insightData,
        relapseData,
        punishmentData,
        tpeData,
        triggerData,
        informationData
      ] = await Promise.allSettled([
        faqService.getAllFAQs(),
        geistService.getAllEntries(),
        keuschheitService.getAllEntries(),
        erkenntnisseService.getAllEntries(),
        rueckfallService.getAllEntries(),
        strafenService.getAllEntries(),
        tpeService.getAllEntries(),
        triggerService.getAllEntries(),
        allgemeineInformationenService.getAllEntries()
      ]);

      if (faqData.status === 'fulfilled') setFaqs(faqData.value);
      if (wellbeingData.status === 'fulfilled') setWellbeing(wellbeingData.value);
      if (chastityData.status === 'fulfilled') setChastity(chastityData.value);
      if (insightData.status === 'fulfilled') setInsights(insightData.value);
      if (relapseData.status === 'fulfilled') setRelapses(relapseData.value);
      if (punishmentData.status === 'fulfilled') setPunishments(punishmentData.value);
      if (tpeData.status === 'fulfilled') setTpeEntries(tpeData.value);
      if (triggerData.status === 'fulfilled') setTriggers(triggerData.value);
      if (informationData.status === 'fulfilled') setInformation(informationData.value);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': case 'extreme': return 'bg-red-500';
      case 'major': case 'severe': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'minor': case 'light': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Daten werden geladen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Entitäten Übersicht</h1>
        <p className="text-muted-foreground">
          Übersicht aller gespeicherten Einträge aus den verschiedenen Formularen
        </p>
        <Button onClick={fetchAllData} className="mt-4">
          Aktualisieren
        </Button>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid grid-cols-9 w-full">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ ({faqs.length})
          </TabsTrigger>
          <TabsTrigger value="geist" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Geist ({wellbeing.length})
          </TabsTrigger>
          <TabsTrigger value="keuschheit" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Keuschheit ({chastity.length})
          </TabsTrigger>
          <TabsTrigger value="erkenntnisse" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Erkenntnisse ({insights.length})
          </TabsTrigger>
          <TabsTrigger value="rueckfaelle" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Rückfälle ({relapses.length})
          </TabsTrigger>
          <TabsTrigger value="strafen" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Strafen ({punishments.length})
          </TabsTrigger>
          <TabsTrigger value="tpe" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            TPE ({tpeEntries.length})
          </TabsTrigger>
          <TabsTrigger value="trigger" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Trigger ({triggers.length})
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Info ({information.length})
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="grid gap-4">
            {faqs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Keine FAQ-Einträge vorhanden
                </CardContent>
              </Card>
            ) : (
              faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(faq.priority)}>
                          {faq.priority}
                        </Badge>
                        {faq.category && <Badge variant="outline">{faq.category}</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{faq.answer}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Von: {faq.creator.displayName}</span>
                      <span>{formatDate(faq.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Wellbeing Tab */}
        <TabsContent value="geist" className="space-y-4">
          <div className="grid gap-4">
            {wellbeing.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Keine Wellbeing-Einträge vorhanden
                </CardContent>
              </Card>
            ) : (
              wellbeing.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge>Stimmung: {entry.mood}/10</Badge>
                        <Badge>Energie: {entry.energy}/10</Badge>
                        {entry.category && <Badge variant="outline">{entry.category}</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entry.description && <p className="text-sm mb-2">{entry.description}</p>}
                    {entry.triggers && (
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Trigger:</strong> {entry.triggers}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{entry.duration && `Dauer: ${entry.duration}`}</span>
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Add more tabs for other entities... */}
        <TabsContent value="keuschheit" className="space-y-4">
          <div className="grid gap-4">
            {chastity.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Keine Keuschheit-Einträge vorhanden
                </CardContent>
              </Card>
            ) : (
              chastity.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{entry.type}</Badge>
                        {entry.duration && <Badge>{entry.duration} min</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {entry.description && <p className="text-sm mb-2">{entry.description}</p>}
                    <div className="flex gap-2 mb-2">
                      {entry.wasPlanned && <Badge variant="secondary">Geplant</Badge>}
                      {entry.wasPermission && <Badge variant="secondary">Mit Erlaubnis</Badge>}
                      {entry.wasReward && <Badge variant="secondary">Belohnung</Badge>}
                      {entry.wasPunishment && <Badge variant="secondary">Strafe</Badge>}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{entry.device && `Gerät: ${entry.device}`}</span>
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Simplified other tabs for now */}
        <TabsContent value="erkenntnisse" className="space-y-4">
          <div className="text-center p-8">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{insights.length} Erkenntnisse gespeichert</p>
          </div>
        </TabsContent>

        <TabsContent value="rueckfaelle" className="space-y-4">
          <div className="text-center p-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{relapses.length} Rückfälle dokumentiert</p>
          </div>
        </TabsContent>

        <TabsContent value="strafen" className="space-y-4">
          <div className="text-center p-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{punishments.length} Strafen dokumentiert</p>
          </div>
        </TabsContent>

        <TabsContent value="tpe" className="space-y-4">
          <div className="text-center p-8">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{tpeEntries.length} TPE-Einträge gespeichert</p>
          </div>
        </TabsContent>

        <TabsContent value="trigger" className="space-y-4">
          <div className="text-center p-8">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{triggers.length} Trigger identifiziert</p>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <div className="text-center p-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>{information.length} Informationen gespeichert</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EntitiesOverviewPage;