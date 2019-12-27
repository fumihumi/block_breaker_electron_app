import React from "react";
import './App.css';

const FIELD_BLOCK_COUNT = 50;
const LIFE = 5000;
const DEFAULT_SCORE = 0;
const DX_DY_PARAM = 5; //速度調整はココ

const movePaddle = ( event ) => {
  const paddle = document.querySelector( "#paddle" );
  if ( !paddle ) return;

  const px = event.pageX > 40 ? ( event.pageX < 290 ? event.pageX - 40 : 256 ) : 0;
  paddle.style.left = px + 'px';
}

const game = ( field, px, dx, dy, life, score ) => {
  const ball = document.querySelector( "#ball" )
  const lifeNode = document.querySelector( "#lifeNode" )
  const scoreNode = document.querySelector( "#scoreNode" )

  if ( !ball || !lifeNode || !scoreNode ) {
    alert( "failed! on L:23" )
    return
  }

  const cycle = setInterval( () => {
    const { left, top } = ball.style;
    const bx = parseFloat( ( ball.style.left = parseFloat( left ) + dx + 'px' ) ) | 0
    const by = parseFloat( ( ball.style.top = parseFloat( top ) + dy + 'px' ) ) | 0
    const row = ( ( by - 30 ) / 14 ) | 0
    const col = ( ( bx / 32 ) ) | 0
    if ( ( bx < 0 && dx < 0 ) || ( bx >= 314 && dx > 0 ) ) dx *= -1;
    if ( bx + 6 >= px && bx <= px + 58 && by >= 259 && by <= 264 ) {
      dy *= -1;
      if ( bx <= px + 15 ) dx = -6;
      else if ( bx >= px + 37 ) dx = 6;
      else if ( Math.abs( dx ) === 6 ) dx = ( ( dx * 2 ) / 3 ) | 0;
    }

    if ( by < 0 ) dy *= -1;

    if ( by >= 288 && !--life ) {
      clearInterval( cycle );
      alert( "Game over!" );
    }

    if ( by >= 288 && life ) {
      dy *= -1;
      lifeNode.innerHTML = String( life );
    }

    if (
      by >= 18 &&
      by <= 100 &&
      field[ row * 10 + col ].className !== "removed"
    ) {
      dy *= -1;
      field[ row * 10 + col ].className = "removed";
      if ( dx < 0 && ( bx % 32 < 10 || bx % 32 > 22 ) ) dx *= -1;
      if ( dx > 0 && ( ( bx + 12 ) % 32 < 10 || ( bx + 12 ) % 32 > 22 ) ) dx *= -1;
      scoreNode.innerHTML = String( ++score );

      if ( score === FIELD_BLOCK_COUNT ) {
        clearInterval( cycle );
        alert( "Victory!" );
      }
    }
  }, 1000 / 60 );

  document.addEventListener( "mousemove", movePaddle, false )

}

export const App = () => {
  React.useEffect( () => {
    const field = document.querySelector( "#field" );
    if ( !field ) {
      alert( "failed, cannot find '#field' dom" );
      return;
    }

    game( field.children, 129, DX_DY_PARAM, DX_DY_PARAM, LIFE, DEFAULT_SCORE );
  }, [] );

  return (
    <div id="field">
      { Array.from( [ ...Array( FIELD_BLOCK_COUNT ).keys() ] ).map( i => (
        <div key={ i } className="brick"></div>
      ) ) }

      <div id="paddle" />
      <div id="ball" style={ { left: "154px", top: "258px" } } />
      <div id="lifeNode" />
      <div id="scoreNode" />
    </div>
  );
};
