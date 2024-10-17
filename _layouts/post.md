---
# Copyright (c) 2022 Mr. Green's Workshop
# Modified by lkxnif, 2024
# MIT License

layout: default
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}

{% comment %} 处理标签格式 {% endcomment %}
{% if page.tags %}
  {% if page.tags[0].size > 1 %}
    {% assign tags = page.tags %}
  {% else %}
    {% assign tags = page.tags | join: ',' | split: ',' %}
  {% endif %}
{% else %}
  {% assign tags = '' %}
{% endif %}

{%- include post_common/post-main.html post = page -%}

{% comment %} 显示修改时间 {% endcomment %}
{% if page.meta_modify_date %}
<p class="last-modified-date">修改时间: {{ page.meta_modify_date | date: "%Y-%m-%d %H:%M:%S %z" }}</p>
{% endif %}

{% comment %} 显示标签 {% endcomment %}
{% if tags != empty %}
<div class="post-tags">
  {% for tag in tags %}
    <span class="tag">{{ tag }}</span>
  {% endfor %}
</div>
{% endif %}

{%-comment-%} Pagination {%-endcomment-%}
{% if site.posts.size > 1 -%}
  {% include multi_lng/get-pages-by-lng.liquid pages = site.posts -%}
  {% if site.data.conf.posts.pager_navigation_post == 'prev_next_buttons' -%}
    {%- include post_common/pager-prev-next-buttons.html pages = lng_pages current_page_url = page.url side_aligned = site.data.conf.posts.pager_prev_next_buttons_side_aligned -%}
  {% elsif site.data.conf.posts.pager_navigation_post == 'page_numbers' %}
    {% include post_common/pager-page-numbers.html pages = lng_pages current_page_url = page.url -%}
  {% endif -%}
{% endif -%}

{% comment %} 评论系统 {% endcomment %}
{% if site.data.conf.posts.comments.engine != empty
  and site.data.conf.posts.comments.engine != nil
  and page.comments_disable != true
%}
  {% include post/comments.html %}
{% endif %}
