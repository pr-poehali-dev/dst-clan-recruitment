import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    '''Get database connection using DATABASE_URL from environment'''
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API for managing news posts
    Args: event with httpMethod (GET, POST, PUT, DELETE), body, queryStringParameters
    Returns: HTTP response with news data or operation result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            
            if news_id:
                cursor.execute(
                    "SELECT id, title, content, author, created_at, updated_at, published FROM news WHERE id = %s",
                    (news_id,)
                )
                news_item = cursor.fetchone()
                if news_item:
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(dict(news_item), default=str)
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'News not found'})
                    }
            else:
                cursor.execute(
                    "SELECT id, title, content, author, created_at, updated_at, published FROM news WHERE published = true ORDER BY created_at DESC LIMIT 50"
                )
                news_list = cursor.fetchall()
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(item) for item in news_list], default=str)
                }
        
        elif method == 'POST':
            admin_key = event.get('headers', {}).get('x-admin-key') or event.get('headers', {}).get('X-Admin-Key')
            if admin_key != 'dst_admin_2024':
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            content = body_data.get('content')
            author = body_data.get('author', 'Admin')
            published = body_data.get('published', True)
            
            if not title or not content:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Title and content are required'})
                }
            
            cursor.execute(
                "INSERT INTO news (title, content, author, published) VALUES (%s, %s, %s, %s) RETURNING id, title, content, author, created_at, published",
                (title, content, author, published)
            )
            conn.commit()
            new_news = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_news), default=str)
            }
        
        elif method == 'PUT':
            admin_key = event.get('headers', {}).get('x-admin-key') or event.get('headers', {}).get('X-Admin-Key')
            if admin_key != 'dst_admin_2024':
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            news_id = body_data.get('id')
            title = body_data.get('title')
            content = body_data.get('content')
            published = body_data.get('published')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'News ID is required'})
                }
            
            update_fields = []
            update_values = []
            
            if title:
                update_fields.append('title = %s')
                update_values.append(title)
            if content:
                update_fields.append('content = %s')
                update_values.append(content)
            if published is not None:
                update_fields.append('published = %s')
                update_values.append(published)
            
            if update_fields:
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                update_values.append(news_id)
                
                query = f"UPDATE news SET {', '.join(update_fields)} WHERE id = %s RETURNING id, title, content, author, created_at, updated_at, published"
                cursor.execute(query, update_values)
                conn.commit()
                updated_news = cursor.fetchone()
                
                if updated_news:
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(dict(updated_news), default=str)
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'News not found'})
                    }
            
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        elif method == 'DELETE':
            admin_key = event.get('headers', {}).get('x-admin-key') or event.get('headers', {}).get('X-Admin-Key')
            if admin_key != 'dst_admin_2024':
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            params = event.get('queryStringParameters') or {}
            news_id = params.get('id')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'News ID is required'})
                }
            
            cursor.execute("DELETE FROM news WHERE id = %s RETURNING id", (news_id,))
            conn.commit()
            deleted = cursor.fetchone()
            
            if deleted:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'id': deleted['id']})
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'News not found'})
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
