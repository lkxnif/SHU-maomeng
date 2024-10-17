"""
Copyright (c) 2024 lkxnif
MIT License

This script is used for automatically translating posts from Chinese to English.
"""

import os
import re
import yaml
import requests
import uuid
from datetime import datetime, timedelta

MS_TRANSLATOR_KEY = os.environ['MS_TRANSLATOR_KEY']
MS_TRANSLATOR_REGION = os.environ['MS_TRANSLATOR_REGION']

def generate_lng_pair(filename, title):
    base_name = os.path.splitext(filename)[0]
    safe_title = re.sub(r'[^\w\s-]', '', title.lower())
    safe_title = re.sub(r'[-\s]+', '-', safe_title).strip('-')
    return f"id_{base_name}_{safe_title}"

def translate_text(text, from_lang='zh-Hans', to_lang='en'):
    try:
        endpoint = "https://api.cognitive.microsofttranslator.com"
        path = '/translate'
        constructed_url = endpoint + path

        params = {
            'api-version': '3.0',
            'from': from_lang,
            'to': to_lang
        }

        headers = {
            'Ocp-Apim-Subscription-Key': MS_TRANSLATOR_KEY,
            'Ocp-Apim-Subscription-Region': MS_TRANSLATOR_REGION,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
        }

        body = [{
            'text': text
        }]

        request = requests.post(constructed_url, params=params, headers=headers, json=body)
        response = request.json()

        return response[0]['translations'][0]['text']
    except Exception as e:
        print(f"翻译错误: {e}")
        return text  # 返回原文，而不是中断整个过程

def process_file(file_path):
    print(f"处理文件: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 解析YAML front matter
    front_matter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if front_matter_match:
        front_matter = yaml.safe_load(front_matter_match.group(1))
        remaining_content = content[front_matter_match.end():]
    else:
        front_matter = {}
        remaining_content = content
    
    # 生成lng_pair（如果不存在）
    if 'lng_pair' not in front_matter:
        filename = os.path.basename(file_path)
        title = front_matter.get('title', 'untitled')
        front_matter['lng_pair'] = generate_lng_pair(filename, title)
        
        # 更新原始中文文件的front matter
        updated_content = "---\n" + yaml.dump(front_matter, allow_unicode=True) + "---\n" + remaining_content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"已更新原始文件的lng_pair: {file_path}")
    
    # 翻译内容
    translated_content = translate_text(remaining_content)
    
    # 创建翻译版本的front matter
    translated_front_matter = front_matter.copy()
    translated_front_matter['title'] = translate_text(front_matter['title'])
    
    # 生成新的文件内容
    new_content = "---\n" + yaml.dump(translated_front_matter, allow_unicode=True) + "---\n" + translated_content
    
    # 保存翻译版本
    translated_file_path = file_path.replace('_posts', 'en/_posts')
    
    os.makedirs(os.path.dirname(translated_file_path), exist_ok=True)
    with open(translated_file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"已翻译并保存: {translated_file_path}")

def should_translate(file_path):
    week_ago = datetime.now() - timedelta(days=7)
    file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
    
    if file_mtime <= week_ago:
        return False
    
    # 检查对应的翻译文件是否存在或是否需要更新
    translated_file_path = file_path.replace('_posts', 'en/_posts')
    
    if not os.path.exists(translated_file_path):
        return True
    
    translated_mtime = datetime.fromtimestamp(os.path.getmtime(translated_file_path))
    return file_mtime > translated_mtime

def main():
    # 只处理中文文章
    posts_dir = '_posts'
    for filename in os.listdir(posts_dir):
        if filename.endswith(('.md', '.markdown')):
            file_path = os.path.join(posts_dir, filename)
            
            # 读取文件的front matter
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                front_matter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
                if front_matter_match:
                    front_matter = yaml.safe_load(front_matter_match.group(1))
                    
                    # 检查是否需要翻译
                    auto_translate = front_matter.get('auto_translate', False)
                    has_lng_pair = 'lng_pair' in front_matter
                    
                    if auto_translate and (not has_lng_pair or should_translate(file_path)):
                        process_file(file_path)
                else:
                    print(f"警告: 文件 {file_path} 没有有效的front matter")

if __name__ == "__main__":
    main()
