import $ from 'jquery';
import DEFAULTS from './defaults';

const NAMESPACE = 'ScrollTo';

/**
 * Plugin constructor
 **/
class ScrollTo {
  constructor(element, options = {}) {
    this.element = element;
    this.$element = $(element);
    this.$doc = $('body');
    this.options = $.extend(true, {}, DEFAULTS, options);

    this.namespace = this.options.namespace;

    this.classes = {
        active: `${this.namespace}_active`,
        animating: `${this.namespace}_animating`,
    };

    this.useMobile = false;
    this.noroll = false;

    this.init();
  }

  init() {
    let that = this;

    this.transition = this.transition();
    this.roll();

    this.$element.on('click.scrollTo', event => {
      event = event || window.event;
      const target = event.target || event.srcElement;
      that.$target = $(target);
      that.active(that.$target);

      const href = that.$target.attr('data-scrollto');

      if(href) {
        that.$anchor = $(`#${href}`);
        that.$doc.trigger(`${NAMESPACE}::jump`);
      }

      return false;
    });

    //bind events
    this.$doc.on(`${NAMESPACE}::jump`, () => {
      that.noroll = true;

      that.checkMobile();

      let easing;
      let speed;

      if (that.useMobile) {
        speed = that.options.mobile.speed;
        easing = that.options.mobile.easing;
      } else {
        speed = that.options.speed;
        easing = that.options.easing;
      }

      if (that.$anchor && that.$anchor.length > 0) {
        that.$doc.addClass(that.classes.animating);

        const top = that.$anchor.offset().top;
        if (that.transition.supported) {
          const pos = $(window).scrollTop();

          that.$doc.css({
            'margin-top': `${-(pos - top)}px`
          });

          $(window).scrollTop(top);

          that.insertRule(`.duration_${speed}{${that.transition.prefix}transition-duration: ${speed}ms;}`);

          that.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
            'margin-top': ''
          }).one(that.transition.end, function() {
            that.noroll = false;
            that.$doc.removeClass(that.classes.animating + ' easing_' + easing + ' duration_' + speed);
          });

        } else {
          $('html, body').animate({
            scrollTop: that.top
          }, speed, () => {
            that.$doc.removeClass(that.classes.animating);
          });

          return;
        }
      } else {
        return;
      }
    });

    $(window).scroll(() => {
      this.roll();
    });
  }

  checkMobile() {
    const width = $(window).width();

    if (width < this.options.mobile.width) {
      this.useMobile = true;
    } else {
      this.useMobile = false;
    }
  }

  active($index) {
    if (typeof $index === 'undefined') {
      return;
    }
    this.$element.children().removeClass(this.classes.active);
    $index.addClass(this.classes.active);
  }

  roll() {
    const that = this;
    if (this.noroll) {
      return;
    }
    this.$doc.find("[id]").each(function() {
      if (($(window).scrollTop() > $(this).offset().top - that.options.offsetTop) && ($(window).scrollTop() < $(this).offset().top + $(this).height())) {
        const anchorHref = $(this).attr('id');
        const $anchor = that.$element.find(`[data-scrollto="${anchorHref}"]`);
        that.$anchor = $(this);
        that.active($anchor);
      }
    });
  }

  transition() {
    let e;
    let end;
    let prefix = '';
    let supported = false;
    const el = document.createElement("fakeelement");

    const transitions = {
      "WebkitTransition": "webkitTransitionEnd",
      "MozTransition": "transitionend",
      "OTransition": "oTransitionend",
      "transition": "transitionend"
    };

    for (e in transitions) {
      if (el.style[e] !== undefined) {
        end = transitions[e];
        supported = true;
        break;
      }
    }
    if (/(WebKit)/i.test(window.navigator.userAgent)) {
      prefix = '-webkit-';
    }
    return {
      prefix,
      end,
      supported
    };
  }

  insertRule(rule) {
    if (this.rules && this.rules[rule]) {
      return;
    } else if (this.rules === undefined) {
      this.rules = {};
    } else {
      this.rules[rule] = true;
    }

    if (document.styleSheets && document.styleSheets.length) {
      document.styleSheets[0].insertRule(rule, 0);
    } else {
      const style = document.createElement('style');
      style.innerHTML = rule;
      document.head.appendChild(style);
    }
  }

  jump() {
    this.$doc.trigger('ScrollTo::jump');
  }

  destroy() {
    this.$trigger.remove();
    this.$element.data('ScrollTo', null);
    this.$element.off('ScrollTo::jump');
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default ScrollTo;
