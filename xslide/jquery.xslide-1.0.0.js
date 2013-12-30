// @title xSlide
// @version 1.0.0
// @author Alexander Volkov
// @license GPL http://www.gnu.org/licenses/gpl.html
// tested with jquery-1.6.4
//
// @example
// <div id="">
//  <div>
//    <img src="" alt="" />
//  </div>
// </div>
//
( function( $)
{
  'use strict';
  $.fn.xSlide = function( options)
  {
    function OnItemShow( item, nPosition)
    {
      item.animate( {opacity: 1}, 700);
    }
    function OnItemHide( item, nPosition)
    {
      item.animate( {opacity: 0}, 300);
    }
    function OnStart()
    {
      if ( self.m_options.starter)
      {
        self.m_options.starter.removeClass( 'stop');
        self.m_options.starter.addClass( 'start');
      }
    }
    function OnStop()
    {
      if ( self.m_options.starter)
      {
        self.m_options.starter.removeClass( 'start');
        self.m_options.starter.addClass( 'stop');
      }
    }
    
    var self = this;

    self.m_options = $.extend({ 'nWidth' : self.width()
                              , 'nHeight' : self.height()
                              , 'bStart' : false
                              , 'nLoopSpeed' : 5000                              
                              , 'nSpeed' : 300
                              , 'Easing' : null
                              , 'bVertical' : false
                              , 'OnItemShow' : OnItemShow
                              , 'OnItemHide' : OnItemHide
                              , 'starter' : false
                              , 'OnStart' : OnStart
                              , 'OnStop' : OnStop
                              , 'comment' : false
                              , 'tostart' : false
                              , 'toend' : false
                              , 'fullsize' : false
                              }
                              , ( options || {})
                              );
    

    self.css( {'overflow' : 'hidden'});
    self.m_imgContainer = self.children( 'div');
    self.m_imgCollection = self.m_imgContainer.children( 'img');
    for ( var i = 0; i < self.m_imgCollection.length; i++)
    {
      var item = $( self.m_imgCollection[ i]);
      var nScaleX = self.m_options.nWidth / item.width();
      var nScaleY = self.m_options.nHeight / item.height();
      if ( nScaleX > nScaleY)
        var nScale = nScaleY;
      else
        var nScale = nScaleX;
      item.height( item.height() * nScale);
      item.width( item.width() * nScale);
      var nMargin = ( self.m_options.nHeight - item.height()) / 2;
      item.css({ 'padding-top' : nMargin, 'padding-bottom' : nMargin})
    }
    self.m_nPosition = 0;
    self.m_nCount = self.m_imgCollection.length;
    self.m_timer = null;    

    self.GoTo = function( nPos, OnEnd)
    {
      if ( nPos >= self.m_nCount)
        nPos = 0;
      if ( self.m_options.bVertical)
        var css = {marginTop: -nPos * self.m_options.nHeight};
      else
        var css = {marginLeft: -nPos * self.m_options.nWidth};

      self.m_options.OnItemHide.call( self, $( self.m_imgCollection.get( self.m_nPosition)), self.m_nPosition);
      self.m_nPosition = nPos;

      if ( self.m_options.comment)
        self.m_options.comment.html( $( self.m_imgCollection[ self.m_nPosition]).attr( 'alt'));
      if ( self.m_options.progress)
        self.m_options.progress.html( '<div ></div>');

      self.m_imgContainer.animate( css
                        , self.m_options.nSpeed
                        , self.m_options.Easing
                        , function()
                          {
                            if ( OnEnd)
                            if ( OnEnd.call)
                              OnEnd.call( self);
                          }
                        );
      self.m_options.OnItemShow.call( self, $( self.m_imgCollection.get( self.m_nPosition)), self.m_nPosition);
      return self;
    }

    self.GoToStart = function( OnEnd)
    {
      return self.GoTo( 0, OnEnd);
    }
    self.GoToEnd = function( OnEnd)
    {
      return self.GoTo(( self.m_nCount - 1), OnEnd);
    }
    self.GoToNext = function( OnEnd)
    {
      return self.GoTo(( self.m_nPosition + 1), OnEnd);
    }
    self.Stop = function()
    {
      self.m_options.bStart = false;
      if ( self.m_options.OnStop)
        self.m_options.OnStop.call( self);
      if ( self.m_options.starter)
      {
        self.m_options.starter.unbind( 'click', self.Stop);
        self.m_options.starter.bind( 'click', self.Start);
      }
    }
    function Loop()
    {
      clearTimeout( self.m_timer);
      self.m_timer = null;
      if ( self.m_options.bStart)
      {
        self.GoToNext( function(){ self.m_timer ? false : self.m_timer = setTimeout( Loop, self.m_options.nLoopSpeed);});
      }
    }
    self.Start = function()
    {
      self.m_options.bStart = true;
      Loop();
      if ( self.m_options.OnStart)
        self.m_options.OnStart.call( self);
      if ( self.m_options.starter)
      {
        self.m_options.starter.unbind( 'click', self.Start);
        self.m_options.starter.bind( 'click', self.Stop);
      }
    }
    function OnFullSize()
    {
      if ( self.m_options.bStart)
        self.Stop();
      var image = $( self.m_imgCollection.get( self.m_nPosition));
      var css = { width: '100%'
                , height: '100%'
                };
      
      self.m_options.fullsizetarget.attr( 'src', image.attr( 'src'));
      self.m_options.fullsizetarget.attr( 'alt', image.attr( 'alt'));
      self.m_options.fullsizetarget.removeAttr( 'width')
                                   .removeAttr( 'height')
                                   .animate( css
                                          , 300
                                          , null
                                          , function()
                                            {
                                              // none
                                            }
                                          );
    }
    
    self.GoTo( -1);

    if ( self.m_options.tostart)
      self.m_options.tostart.bind( 'click', self.GoToStart);
    if ( self.m_options.toend)
      self.m_options.toend.bind( 'click', self.GoToEnd);
    if ( self.m_options.fullsize)
    if ( self.m_options.fullsizetarget)
      self.m_options.fullsize.bind( 'click', OnFullSize);    

    if ( self.m_options.bStart)
      self.Start();
    else
      self.Stop();

    return self;
  }
}( jQuery));