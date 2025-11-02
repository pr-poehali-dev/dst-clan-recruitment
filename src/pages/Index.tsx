import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  published: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const API_URL = 'https://functions.poehali.dev/a895bd2c-84f2-4f61-8571-1d9c2ad1c863';

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setNews(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading news:', error);
      }
      setLoadingNews(false);
    };
    loadNews();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const requirements = [
    { icon: 'Clock', text: '3000+ часов в игре', value: '3000+' },
    { icon: 'Shield', text: 'Знание всех РТ', value: 'Все РТ' },
    { icon: 'User', text: 'Возраст от 16 лет', value: '16+' },
    { icon: 'Timer', text: 'Онлайн 6+ часов/день', value: '6+ часов' },
    { icon: 'Brain', text: 'Полное понимание механик', value: 'Про' },
    { icon: 'Heart', text: 'Адекватность', value: 'Must have' }
  ];

  const achievements = [
    { title: 'Победитель турнира "Зимний шторм"', date: 'Декабрь 2024', icon: 'Trophy' },
    { title: 'Топ-3 на "RustCon Pro League"', date: 'Ноябрь 2024', icon: 'Award' },
    { title: '500+ успешных рейдов', date: '2024', icon: 'Target' },
    { title: 'Лучший клан месяца x3', date: '2024', icon: 'Star' }
  ];

  const tournaments = [
    { name: 'Зимний шторм 2024', place: '🥇 1 место', prize: '500,000₽' },
    { name: 'RustCon Pro League', place: '🥉 3 место', prize: '150,000₽' },
    { name: 'Autumn Raid Masters', place: '🥇 1 место', prize: '300,000₽' },
    { name: 'Summer Clash', place: '🥈 2 место', prize: '200,000₽' }
  ];

  const members = [
    { name: 'DarkShadow', role: 'Лидер клана', hours: '5200+', avatar: '👑' },
    { name: 'PhoenixFire', role: 'Зам. лидера', hours: '4800+', avatar: '🔥' },
    { name: 'IceBreaker', role: 'Атакующий', hours: '4500+', avatar: '⚔️' },
    { name: 'SilentSniper', role: 'Снайпер', hours: '4200+', avatar: '🎯' },
    { name: 'TechWizard', role: 'Строитель', hours: '3900+', avatar: '🛠️' },
    { name: 'StormRider', role: 'Фармер', hours: '3700+', avatar: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-primary/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-border">
                <span className="text-2xl font-black text-white">DST</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white glow-text">DST CLAN</h1>
                <p className="text-xs text-muted-foreground">Легенды Rust</p>
              </div>
            </div>
            <div className="hidden md:flex gap-6">
              {['Главная', 'Новости', 'О клане', 'Требования', 'Достижения', 'Турниры', 'Участники'].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold glow-hover"
              onClick={() => window.open('https://discord.gg/qcu8n8rRg6', '_blank')}
            >
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Discord
            </Button>
          </div>
        </div>
      </nav>

      <section id="главная" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-slide-up">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/50 px-4 py-2 text-lg animate-pulse-glow">
              ⚡ Набор открыт
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 glow-text bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              ВНИМАНИЕ! НАБОР В КЛАНЕ DST!
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Мы — команда, где каждый важен! Объединяемся для крутых рейдов, побед и незабываемых эмоций!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6 glow-hover"
                onClick={() => window.open('https://discord.gg/qcu8n8rRg6', '_blank')}
              >
                <Icon name="Users" size={24} className="mr-2" />
                Присоединиться
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-bold text-lg px-8 py-6"
                onClick={() => scrollToSection('требования')}
              >
                <Icon name="FileText" size={24} className="mr-2" />
                Требования
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="новости" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-12 glow-text">Последние новости</h3>
          {loadingNews ? (
            <p className="text-center text-muted-foreground">Загрузка новостей...</p>
          ) : news.length === 0 ? (
            <p className="text-center text-muted-foreground">Новостей пока нет</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item, idx) => (
                <Card key={item.id} className="bg-card border-primary/20 glow-hover animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                      <span>•</span>
                      <Icon name="User" size={14} />
                      <span>{item.author}</span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{item.content}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="о-клане" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-12 glow-text">Почему выбирают DST?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Star', title: 'Опытные лидеры', desc: 'Профессиональное руководство' },
              { icon: 'Target', title: 'Организация рейдов', desc: 'Четкая стратегия побед' },
              { icon: 'BookOpen', title: 'Обучение новичков', desc: 'Делимся знаниями' },
              { icon: 'Flame', title: 'Активное сообщество', desc: 'Веселье и позитив' }
            ].map((item, idx) => (
              <Card key={idx} className="bg-card border-primary/20 glow-hover animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 glow-border">
                    <Icon name={item.icon as any} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="требования" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-4 glow-text">Требования к кандидатам</h3>
          <p className="text-center text-muted-foreground mb-12 text-lg">Исключения для талантов — приветствуются!</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req, idx) => (
              <Card key={idx} className="bg-card border-secondary/30 hover:border-secondary glow-hover animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center glow-border">
                      <Icon name={req.icon as any} size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{req.text}</CardTitle>
                      <Badge className="bg-secondary/20 text-secondary border-secondary/50">{req.value}</Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="достижения" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-12 glow-text">Наши достижения</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {achievements.map((ach, idx) => (
              <Card key={idx} className="bg-card border-primary/20 glow-hover animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 glow-border">
                      <Icon name={ach.icon as any} size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{ach.title}</h4>
                      <p className="text-sm text-muted-foreground">{ach.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="турниры" className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-12 glow-text">Выигранные турниры</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tournaments.map((tournament, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-card to-card/50 border-secondary/30 glow-hover animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{tournament.name}</CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/20 text-primary border-primary/50 text-lg px-3 py-1">
                          {tournament.place}
                        </Badge>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/50 text-lg px-3 py-1">
                          {tournament.prize}
                        </Badge>
                      </div>
                    </div>
                    <Icon name="Trophy" size={48} className="text-primary animate-pulse-glow" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="участники" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center mb-12 glow-text">Состав клана</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, idx) => (
              <Card key={idx} className="bg-card border-primary/20 glow-hover animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl glow-border">
                      {member.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-secondary font-semibold">{member.role}</CardDescription>
                      <Badge className="bg-primary/20 text-primary border-primary/50 mt-2">
                        {member.hours} часов
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="вступить" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-12 glow-border animate-slide-up">
            <Icon name="Rocket" size={64} className="text-primary mx-auto mb-6 animate-pulse-glow" />
            <h3 className="text-4xl font-black mb-6 glow-text">Не упусти свой шанс!</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Вступай прямо сейчас и стань частью нашей истории! Ждём именно тебя! Вперёд к новым вершинам!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-xl px-12 py-8 glow-hover"
              onClick={() => window.open('https://discord.gg/qcu8n8rRg6', '_blank')}
            >
              <Icon name="MessageCircle" size={28} className="mr-3" />
              Присоединиться к Discord
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-primary/20 bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-border">
              <span className="text-lg font-black text-white">DST</span>
            </div>
            <span className="text-xl font-black glow-text">DST CLAN</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 DST Clan. Все права защищены.</p>
          <p className="text-xs text-muted-foreground mt-2">Легенды рождаются здесь 🚀</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;