---


layout: default
# The Archives of posts.
---
{%- assign archived_posts = site.posts | where: "archive", true -%}
{%- include multi_lng/get-pages-by-lng.liquid pages = archived_posts -%}
{%- assign postsByYear = lng_pages | sort: "archive_date" | reverse | group_by_exp:"post", "(post.archive_date | default: post.date) | date: site.data.lang[lng].date.year" -%}
<div class="multipurpose-container">
  <h1>{{ site.data.lang[lng].archives.page_header }}</h1>
  <div class="archives">
    {%- for year in postsByYear %}
    <div class="year">
      <h2>{{ year.name }}</h2>
      {%- assign postsByMonth = year.items | group_by_exp:"post", "(post.archive_date | default: post.date) | date: '%m'" -%}
      {%- assign sortedMonths = postsByMonth | sort: "name" | reverse -%}
      {%- for month in sortedMonths -%}
      <div class="month">
        {%- assign monthInt = month.name | plus: 0 -%}
        {%- assign monthInt = monthInt | minus: 1 %}
        <h3>{{ site.data.lang[lng].date.months[monthInt] }}</h3>
        <ul>
        {%- assign sortedPosts = month.items | sort: "archive_date" | reverse -%}
        {%- for post in sortedPosts %}
          <li>
            <span>{{ post.archive_date | default: post.date | date: site.data.lang[lng].date.day }}</span>
            {%- assign page_title = post.title -%}
            {%- include util/auto-content-post-title-rename.liquid title = page_title -%}
            <a href="{{ post.url | relative_url }}">{{ page_title }}</a>
          </li>
        {%- endfor %}
        </ul>
      </div>
      {% endfor -%}
    </div>
    {%- endfor %}
  </div>
</div>
