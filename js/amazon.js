;
(function() {
  if (document.getElementById('dm-yelp-crawl-panel')) return;
  window.__APUCK_AMZ_AFFLIATE = function() {
    // "特别注意：https://schema.org/LocalBusiness
    // 1. 餐饮类用 Restaurant
    // 2. 律师用 LegalService
    // 3. 会计用 FinancialService
    // 4. 车行用 AutomotiveBusiness
    // 5. 地产经纪用 RealEstateAgent
    // 6. 其他都用 LocalBusiness"
    var itemTypes = [
      'Restaurant',
      'LegalService',
      'FinancialService',
      'AutomotiveBusiness',
      'RealEstateAgent',
      'LocalBusiness'
    ];
    var microData = document.querySelector(itemTypes.map((t) => (`[itemtype="https://schema.org/${t}"], [itemtype="http://schema.org/${t}"]`)).join(', '));
    function querySelector(s, root) {
      var node = (root || microData);
      var items = node.querySelectorAll(s);
      var selected;
      [].every.call(items, function (item) {
        if (item.parentNode === node) {
          selected = item;
          return false;
        }
        return true;
      });
      if (!selected) {
        selected = items[0];
      }
      return selected;
    }
    function getText(s, a, root) { var e = querySelector(s, root), s = e ? (a ? e[a] : e.innerText) : ''; if (s) { if (typeof s === 'string') { s = s.trim(); } else { s += ''; }} else { s = ''; } return s; }
    function getAttribute(s, a) {
      var e = querySelector(s);
      return ((e ? e.getAttribute(a || 'content') : '') || '').trim();
    }
    var productTitle = getAttribute('[class="amzn-native-product-title-text"]','title');
    if (!productTitle) {
      alert('Please click "Custom" on SiteStripe');
      return;
    }
    var productSubTitle = getAttribute('[class="amzn-native-product-subtitle"]','title')

    var productCopyContent = getText('[id="amzn-native-adcode-custom"]')

    var frame = document.createElement('div'),
      frameId = 'dm-post-frame',
      html = document.documentElement.outerHTML,
      form;
    var data = {
      title: '',
      subTitle: '',
      content: ''
      url: location.href.split('#')[0]
    };

    data.title = productTitle;
    data.subTitle = productSubTitle || "";
    data.content = productCopyContent || "NOT FOUND";
    /*
    data.nameEn = productTitle;
    // var address = getText('address[itemprop="address"] [itemprop="streetAddress"]').trim().replace(/[\r\n]+/g, '\n').split('\n');
    var address = microData.querySelector('address[itemprop="address"] [itemprop="streetAddress"]');
    if (address) {
      address.innerHTML = (address.innerHTML || '').replace(/<br\s?\/?>/g, '\r\n');
      data.address = address.innerText.trim().replace(/[\r\n]+/g, '\n').split('\n').join(' ');
    } else {
      data.address = '';
    }
    data.countyName = getText('address[itemprop="address"] [itemprop="addressLocality"]');
    data.state = getText('address[itemprop="address"] [itemprop="addressRegion"]');
    data.zipcode = getText('address[itemprop="address"] [itemprop="postalCode"]');

    data.website = /[?|&]url=([^&]+)/.test(getText('.biz-website a', 'href', document)) ? decodeURIComponent(RegExp.$1) : getText('.biz-website a', '', document);
    if (!data.website) {
      data.website = /[?|&]url=([^&]+)/.test(getText('a[href^="/biz_redir?url=http"]', 'href', document)) ? decodeURIComponent(RegExp.$1) : getText('.biz-website a', '', document)
    }
    data.category = getText('.category-str-list', '', document).replace(/,\s+/g, ',');
    if (!data.category) {
      data.category = [].map.call(document.querySelectorAll(' .main-content-wrap .u-space-t3.u-space-b6 a[href^="/c/"][target][rel]:not([role])'), (a) => (a.innerText)).join(',');
    }
    var map = getText('img[src^="https://maps.googleapis.com/maps/api/staticmap"]', 'src', document);
    if (/[?|&]center=([^&]+)/.test(map)) {
      var coords = decodeURIComponent(RegExp.$1).split(',');
      data.lat = coords[0];
      data.lon = coords[1] || '';
    }
    var yelp_main__BizHours = document.querySelector('div[data-hypernova-key*="yelp_main__BizHours"]');
    if (!yelp_main__BizHours) {
      yelp_main__BizHours = document.querySelector('.biz-hours table');
    }
    if (!yelp_main__BizHours) {
      yelp_main__BizHours = document.querySelector('table');
    }
    if (yelp_main__BizHours) {
      var yelpBizHours = [].map.call(yelp_main__BizHours.querySelectorAll('tr'), function(tr) {
        var cells = tr.cells;
        if (cells.length > 1) {
          return cells[0].innerText.trim() + ',' + cells[1].innerText.replace(/[\r\n]+/g, ',').trim().replace(/,$/, '');
        } else {
          return '';
        }
      }).join(';');
      if (yelpBizHours && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(yelpBizHours)) {
        data.hours = yelpBizHours;
      }
    }
    var yelp_main__UpcomingSpecialHours = document.querySelector('div[data-hypernova-key*="yelp_main__UpcomingSpecialHours"]');
    if (yelp_main__UpcomingSpecialHours) {
      data.specialHours = [].map.call(yelp_main__UpcomingSpecialHours.querySelectorAll('tr'), function(tr) {
        var cells = tr.cells;
        if (cells.length > 1) {
          return cells[0].innerText.trim() + ',' + cells[1].innerText.replace(/[\r\n]+/g, ',').trim().replace(/,$/, '');
        } else {
          return '';
        }
      }).join(';');
    }
    yelp_main__BizHours || yelp_main__UpcomingSpecialHours || [].forEach.call(document.querySelectorAll('.biz-hours table'), function(table) {
      var hours = [].map.call(table.querySelectorAll('tr'), function(tr) {
        var cells = tr.cells;
        if (cells.length > 1) {
          return cells[0].innerText.trim() + ',' + cells[1].innerText.replace(/[\r\n]+/g, ',').trim().replace(/,$/, '');
        } else {
          return '';
        }
      }).join(';');
      if (table.parentNode.classList.contains('js-special-hours-widget')) {
        data.specialHours = hours;
      } else {
        data.hours = hours;
      }
    });

    data.serviceTags = [].map.call(document.querySelectorAll('.short-def-list dl'), function(dl) {
      var dt = dl.querySelector('dt'),
        dd = dl.querySelector('dd');
      if (dt && dd) {
        return dt.innerText.trim() + ',' + dd.innerText.trim();
      } else {
        return '';
      }
    }).join(';');
    if (!data.serviceTags) {
      var yelpServiceTagsTitle = [].find.call(document.querySelectorAll('h3'), (h3) => (h3.innerText === 'Known For'));
      if (yelpServiceTagsTitle && yelpServiceTagsTitle.parentNode && yelpServiceTagsTitle.parentNode.parentNode) {
        var serviceTagExpanerButton;
        var serviceTagRoot = yelpServiceTagsTitle.parentNode.parentNode.nextElementSibling;
        if (serviceTagRoot) {
          serviceTagExpanerButton = serviceTagRoot.parentNode.parentNode.querySelector('[aria-controls^="expander-link-content"]');
        } else {
          serviceTagRoot = yelpServiceTagsTitle.parentNode.parentNode;
          serviceTagExpanerButton = serviceTagRoot.parentNode.querySelector('[aria-controls^="expander-link-content"]');
          if (!serviceTagExpanerButton) {
            serviceTagExpanerButton = serviceTagRoot.parentNode.parentNode.querySelector('[aria-controls^="expander-link-content"]')
          }
        }
          if (serviceTagExpanerButton && typeof serviceTagExpanerButton.click === 'function' && serviceTagExpanerButton.getAttribute('aria-expanded') === 'false') {
            serviceTagExpanerButton.click();
          }
        if (serviceTagRoot) {
          var labels = serviceTagRoot.querySelectorAll('span');
          var labelCount = labels.length;
          var yelpServiceTags = [];

          if (labelCount > 0 && labelCount % 3 === 0) {
            for (var labelIndex = 0; labelIndex < labelCount; labelIndex += 3) {
              var labelKey = labels[labelIndex + 1].innerText.trim();
              var labelValue = labels[labelIndex + 2].innerText.trim();
              if (labelKey && labelValue) {
                yelpServiceTags.push([labelKey, labelValue].join(','));
              }
            }
          }
        }
        if (yelpServiceTags.length) {
          data.serviceTags = yelpServiceTags.join(';')
        }
      }
      */
    }

    frame.id = 'apuck-amz-panel';
    document.body.appendChild(frame);

    frame.innerHTML = '<div class=container>' +
      '<h3 class=title>确认商家信息</h3>' +
      '<span class=close onclick=document.body.removeChild(this.parentNode.parentNode)>X</span>' +
      '<iframe id=' + frameId + ' name=' + frameId + ' frameborder=0></iframe>' +
      '<form method=post target=' + frameId + ' action=https://' + (window.__APUCK_AMZ_AFFLIATE_HOST || 'adm.dealmoon.com') + '/admin/local/v1/store/crawl-html class=confirm>' +
      '<div class=details>' +
      '<p><label><span class=label>Title</span><input style="width:291px" type=text size=40 name=title /></label></p>' +
      '<p><label><span class=label>Subtitle</span><input style="width:291px" type=text size=40 name=subtitle /></label></p>' +
      '<p><label><span class=label>content: </span><textarea style="width:291px" rows=4 cols=40 name=content></textarea></label></p>' +
      '</div>' +
      '<input name=sourceUrl type=hidden />' +
      '<p class="status">...</p>' +
      '<p class=buttons>' +
        '<input class="submit audit-submit" style="background: #fff; color: #ff285a; border: 2px solid #ff285a;" name=type type=submit value=加入审核 />' +
        '<input class="submit allow-submit" style="background: #ff285a; color: #fff; border: 0 none;" name=type type=submit value=收录商家 />' +
      '</p></div>' +
      '</div>';
    frame.style.cssText = 'position: fixed; right: 0; top: 0; z-index: 9999; background: #fff; border: 2px solid #ff285a; box-shadow: 0 0 5px rgba(0,0,0,.3);';
    frame.querySelector('.title').style.cssText = 'position: absolute; left: 20px; top: 5px; line-height: 30px; font-size: 17px;';
    frame.querySelector('.close').style.cssText = 'position: absolute; right: 14px; top: 5px; width: 30px; height: 30px; line-height: 30px; font-size: 20px; font-size: 700; text-align: center; cursor: pointer; transform: scaleX(1.5);';
    frame.querySelector('iframe').style.cssText = 'display: none; opacity: .5; position: absolute; z-index: 1; width: 95%; height: 88%; margin: 0 20px 20px 20px; border: 0 none; background: #fff; border-top: 1px solid #ccc; border-bottom: 20px solid #fff;';
    frame.querySelector('.container').style.cssText = 'padding: 40px 0 0 0;';
    form = frame.querySelector('form');
    form.querySelector('.details').style.cssText = 'width: 395px; height: 400px; margin: 20px 0 10px 0; padding: 10px; overflow: auto; border: 1px solid #ccc;';
    form.querySelector('.status').style.cssText = 'margin-top: 10px; font-size: 14px; text-align: center;';
    form.querySelector('.buttons').style.cssText = 'visibility: hidden;text-align: center;';
    form.style.cssText = 'min-height: 300px; margin: 0 20px 20px 20px; border: 0 none; border-top: 1px solid #ccc;';
    [].forEach.call(form.querySelectorAll('.submit'), function(input) {
      input.style.cssText += 'display: none; -webkit-appearance: none; width: 160px; height: 40px; margin: 0 20px; font-size: 17px; cursor: pointer';
    });
    [].forEach.call(form.querySelectorAll('label'), function(label) {
      label.style.cssText += 'margin-right: 15px;';
    });
    [].forEach.call(form.querySelectorAll('.label'), function(label) {
      label.style.cssText += 'line-height: 20px; vertical-align: top';
    });
    [].forEach.call(form.querySelectorAll('textarea'), function(textarea) {
      textarea.style.cssText += 'resize: none; box-sizing: border-box; border: 1px solid #999;';
    });
    [].forEach.call(form.querySelectorAll('input[type=text]'), function(input) {
      input.style.cssText += 'height: 20px; box-sizing: border-box; border: 1px solid #999;';
    });
    for (var key in data) {
      var element = form.elements[key];
      if (element) {
        element.value = data[key] || '';
      }
    }
    form.elements['sourceUrl'].value = location.href;
    form.onsubmit = function() { if (this.disabled) { return false; } frame.querySelector('iframe').style.display = 'block'; };
    frame.querySelector('iframe').onload = function() { this.style.opacity = 1; };
    if (data.phone || data.url) {
      var script = document.createElement('script');
      var callback = '__dm_biz_fetch_phone_callback_' + Date.now();
      /**
 * 商家审核的状态('unaudited','first_review','pass','not_pass','delete')
 */
// public static final String UNAUDITED = "unaudited"; //待审核商家
// public static final String FIRST_REVIEW = "first_review"; //优先待审商家
// public static final String NOT_PASS = "not_pass"; //不可用商家
// public static final String ONLINE = "online";  //线上商家

// new   新商家
      window[callback] = function(result) {
        var status = '';
        if (result && result.success) {
          var auditButton = false, allowButton = true;
          var auditButtonText = '加入审核';
          if (Array.isArray(result.data)) {
            if (result.data.indexOf('online') >= 0) {
              auditButton = false;
              allowButton = false;
              status = '已存在线上商家';
              form.disabled = true;
            } else if(result.data.indexOf('first_review') >= 0) {
              auditButton = false;
              allowButton = false;
              status = '已存在优先待审中';
              form.disabled = true;
            } else if(result.data.indexOf('unaudited') >= 0) {
              auditButton = true;
              allowButton = false;
              status = '已存在待审核中';
              auditButtonText = '加入优先待审';
            } else if(result.data.indexOf('not_pass') >= 0) {
              auditButton = true;
              allowButton = false;
              auditButtonText = '加入优先待审';
              status = '已存在「不可用」的爬取商家';
            }
          }
          auditButton && (form.querySelector('.audit-submit').style.display = 'inline-block', form.querySelector('.audit-submit').value = auditButtonText/* += 'pointer-events: none; background: #ccc; border: 0 none; color: #fff;' */);
          allowButton && (form.querySelector('.allow-submit').style.display = 'inline-block'/*'pointer-events: none; background: #ccc; border: 0 none; color: #fff;'*/);
        }
        form.querySelector('.status').innerHTML = status;
      };
      script.onload = script.onerror = function() {
        document.body.removeChild(this);
        window[callback] = undefined;
        form.querySelector('.buttons').style.visibility = 'visible';
      };
      script.src = 'https://' + (window.__APUCK_AMZ_AFFLIATE_HOST || 'apuck.com') +
       '/admin/local/v1/store/crawl-phone?phone=' + encodeURIComponent(data.phone) + '&sourceUrl=' + encodeURIComponent(data.url) + '&callback=' + callback;
      document.body.appendChild(script);
    } else {
      form.querySelector('.buttons').style.visibility = 'visible';
    }
  };
  window.__APUCK_AMZ_AFFLIATE();
})();