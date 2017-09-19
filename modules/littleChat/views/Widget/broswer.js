
exports.init = function () {
  this.Event.addTrigger('click',
    function () {
      return true;
    }.bind(this),
    function ($element) {
      var broswerClick = $element.getAttribute('broswerClick'),
        onBroswerClick = $element.onBroswerClick,
        triggerElement = this.Event.triggerElement;
      if (broswerClick || onBroswerClick) {
        if (onBroswerClick) {
          onBroswerClick.call($element);
        } else if (broswerClick) {
          var broswerTitle = $element.getAttribute('broswerTitle');

          location.href = '#Broswer/Tab?url=' + encodeURIComponent(broswerClick) + '&title=' + encodeURIComponent(broswerTitle);
        }
      } else
        return 'pass';
    }.bind(this)
  );
}