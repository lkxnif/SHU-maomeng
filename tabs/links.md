---
layout: links
# multilingual page pair id, this must pair with translations of this page. (This name must be unique)
lng_pair: id_links

# publish date (used for seo)
# if not specified, site.time will be used.
#date: 2022-03-03 12:32:00 +0000

# for override items in _data/lang/[language].yml
#title: My title
#button_name: "My button"
# for override side_and_top_nav_buttons in _data/conf/main.yml
#icon: "fa fa-bath"

# seo
# if not specified, date will be used.
#meta_modify_date: 2022-03-03 12:32:00 +0000
# check the meta_common_description in _data/owner/[language].yml
#meta_description: ""

# optional
# please use the "image_viewer_on" below to enable image viewer for individual pages or posts (_posts/ or [language]/_posts folders).
# image viewer can be enabled or disabled for all posts using the "image_viewer_posts: true" setting in _data/conf/main.yml.
#image_viewer_on: true
# please use the "image_lazy_loader_on" below to enable image lazy loader for individual pages or posts (_posts/ or [language]/_posts folders).
# image lazy loader can be enabled or disabled for all posts using the "image_lazy_loader_posts: true" setting in _data/conf/main.yml.
#image_lazy_loader_on: true
# exclude from on site search
#on_site_search_exclude: true
# exclude from search engines
#search_engine_exclude: true
# to disable this page, simply set published: false or delete this file
#published: false


# you can always move this content to _data/content/ folder
# just create new file at _data/content/links/[language].yml and move content below.
###########################################################
#                Links Page Data
###########################################################
page_data:
  main:
    header: "盟友"
    info: "链接页面描述。"

  # To change order of the Categories, simply change order. (you don't need to change list order.)
  category:
    - title: "友情链接"
      type: id_friends
      color: "#6989B9"
    - title: "机构支持"
      type: id_institutions
      color: "#A9C1A3"
    - title: "个人支持"
      type: id_personal
      color: "#E3BF2B"

  list:
    -
    # 个人支持
    - type: id_personal
      title: "Github猫盟开源项目"
      url: "https://github.com/lkxnif/shu-maomeng"
      info: "基于 GitHub Pages 和 Jekyll 构建的猫盟开源项目"

    # 友情链接
    - type: id_friends
      title: "迷途之家shuhapa"
      url: "https://www.xiaohongshu.com/user/profile/6425bb7d0000000029016465"
      info: "上海大学宝山校区流浪动物救助"
    - type: id_friends
      title: "暖阳小窝SHU"
      url: "https://v.douyin.com/iBwPM2qu/"
      info: "上海大学嘉定校区流浪动物救助"
    - type: id_friends
      title: "衔蝉书斋"
      url: "https://www.xiaohongshu.com/user/profile/63878fc0000000001f01c0f1"
      info: "上海大学延长校区流浪动物救助"
    

    # 机构支持
    - type: id_institutions
      title: "上海大学"
      url: "https://www.shu.edu.cn/"
      info: "上海大学"
---
