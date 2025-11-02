import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    published: true
  });

  const API_URL = 'https://functions.poehali.dev/a895bd2c-84f2-4f61-8571-1d9c2ad1c863';

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
      loadNews(savedKey);
    }
  }, []);

  const loadNews = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'X-Admin-Key': key
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    if (adminKey === 'dst_admin_2024') {
      localStorage.setItem('admin_key', adminKey);
      setIsAuthenticated(true);
      loadNews(adminKey);
    } else {
      alert('Неверный ключ администратора');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setNews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingNews ? 'PUT' : 'POST';
      const body = editingNews 
        ? { ...formData, id: editingNews.id }
        : formData;

      const response = await fetch(API_URL, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setFormData({ title: '', content: '', author: 'Admin', published: true });
        setEditingNews(null);
        loadNews(adminKey);
        alert(editingNews ? 'Новость обновлена!' : 'Новость добавлена!');
      } else {
        alert('Ошибка при сохранении новости');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка при сохранении новости');
    }
    setLoading(false);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      author: item.author,
      published: item.published
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': adminKey
        }
      });

      if (response.ok) {
        loadNews(adminKey);
        alert('Новость удалена!');
      } else {
        alert('Ошибка при удалении новости');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Ошибка при удалении новости');
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setFormData({ title: '', content: '', author: 'Admin', published: true });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-border">
                <Icon name="Shield" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Админ-панель DST</CardTitle>
            <CardDescription className="text-center">Введите ключ администратора</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Ключ администратора"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-background border-primary/30"
              />
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold"
              >
                Войти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-primary/20 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-border">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black glow-text">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Управление новостями</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-primary/30"
              >
                <Icon name="Home" size={18} className="mr-2" />
                На сайт
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name={editingNews ? 'Edit' : 'Plus'} size={24} />
                  {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                </CardTitle>
                <CardDescription>
                  {editingNews ? 'Внесите изменения и сохраните' : 'Создайте новую публикацию для сайта'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Заголовок</label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Заголовок новости"
                      className="bg-background border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Содержание</label>
                    <Textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Содержание новости"
                      rows={8}
                      className="bg-background border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Автор</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Имя автора"
                      className="bg-background border-primary/30"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="published" className="text-sm font-semibold">
                      Опубликовать сразу
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold"
                    >
                      {loading ? 'Сохранение...' : editingNews ? 'Обновить' : 'Опубликовать'}
                    </Button>
                    {editingNews && (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-primary/30"
                      >
                        Отмена
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Newspaper" size={24} />
                  Все новости ({news.length})
                </CardTitle>
                <CardDescription>Управление опубликованными новостями</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && <p className="text-center text-muted-foreground">Загрузка...</p>}
                {!loading && news.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Новостей пока нет</p>
                )}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {news.map((item) => (
                    <Card key={item.id} className="bg-background border-primary/10">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {item.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon name="User" size={14} />
                              <span>{item.author}</span>
                              <span>•</span>
                              <Icon name="Calendar" size={14} />
                              <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                              {!item.published && (
                                <Badge className="bg-secondary/20 text-secondary border-secondary/50 ml-2">
                                  Черновик
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            className="border-primary/30"
                          >
                            <Icon name="Edit" size={16} className="mr-1" />
                            Изменить
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="border-destructive/30 text-destructive hover:bg-destructive/10"
                          >
                            <Icon name="Trash2" size={16} className="mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
