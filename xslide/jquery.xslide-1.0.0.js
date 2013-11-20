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

    this.m_options = $.extend({ 'nWidth' : this.width()
                              , 'nHeight' : this.height()
                              , 'bStart' : false
                              , 'nLoopSpeed' : 5000                              
                              , 'nSpeed': 300
                              , 'Easing': null
                              , 'bVertical' : false
                              , 'OnItemShow' : OnItemShow
                              , 'OnItemHide' : OnItemHide
                              , 'starter' : false
                              , 'OnStart' : false
                              , 'OnStop' : false                              
                              }
                              , ( options || {})
                              );

    this.css( {'overflow' : 'hidden'});
    this.m_imgContainer = this.children( 'div');
    this.m_imgCollection = this.m_imgContainer.children( 'img');
    for ( var i = 0; i < this.m_imgCollection.length; i++)
    {
      var item = $( this.m_imgCollection[ i]);

      var nScaleX = this.m_options.nWidth / item.width();
      var nScaleY = this.m_options.nHeight / item.height();

      if ( nScaleX > nScaleY)
        var nScale = nScaleY;
      else
        var nScale = nScaleX;

      item.height( item.height() * nScale);
      item.width( item.width() * nScale);

      var nMargin = ( this.m_options.nHeight - item.height()) / 2;
      item.css({ 'padding-top' : nMargin, 'padding-bottom' : nMargin})
    }
    this.m_nPosition = 0;
    this.m_nCount = this.m_imgCollection.length;
    this.m_timer = null;
    var self = this;

    this.GoTo = function( nPos, OnEnd)
    {
      if ( nPos >= this.m_nCount)
        nPos = 0;
      if ( self.m_options.bVertical)
        var css = {marginTop: -nPos * self.m_options.nHeight};
      else
        var css = {marginLeft: -nPos * self.m_options.nWidth};

      this.m_options.OnItemHide.call( self, $( self.m_imgCollection.get( self.m_nPosition)), self.m_nPosition);
      this.m_nPosition = nPos;      
      this.m_imgContainer.animate( css
                        , self.m_options.nSpeed
                        , self.m_options.Easing
                        , function()
                          {
                            if ( OnEnd)
                              OnEnd.call( self);
                          }
                        );
      self.m_options.OnItemShow.call( self, $( self.m_imgCollection.get( self.m_nPosition)), self.m_nPosition);
      return self;
    }

    this.GoToStart = function( OnEnd)
    {
      return self.GoTo( 0, OnEnd);
    }
    this.GoToEnd = function( OnEnd)
    {
      return self.GoTo(( this.m_nCount - 1), OnEnd);
    }
    this.GoToNext = function( OnEnd)
    {
      return self.GoTo(( this.m_nPosition + 1), OnEnd);
    }
    this.Stop = function()
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
    this.Start = function()
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

    if ( self.m_options.bStart)
      this.Start();
    else
      this.Stop();

    return this;
  }  
}( jQuery));