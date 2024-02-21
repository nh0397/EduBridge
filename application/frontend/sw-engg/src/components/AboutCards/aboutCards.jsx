import React, { useEffect } from 'react';
import './aboutCards.scss';
import {Link} from "react-router-dom";

const aboutCards = (props) =>{
  console.log("props", props)
  return (
      <>
        <Link to={`/about/${props.details.name.replace(' ', '-')}`}>
          <div class="responsive-cell-block wk-desk-3 wk-ipadp-3 wk-tab-6 wk-mobile-12 team-card-container">
            <div class="team-card">
              <div class="img-wrapper">
                <img class="team-img" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/expert1.png"/>
              </div>
              <p class="text-blk name">
                {props.details.name}
              </p>
              <p class="text-blk position">
                {props.details.role}
              </p>
              <div class="social-media-links">
                <a href="http://www.instagram.com/" target="_blank">
                  <img src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-insta.svg"/>
                </a>
                <a href="http://www.gmail.com/" target="_blank">
                  <img src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-mail.svg"/>
                </a>
              </div>
            </div>
          </div>
        </Link>
      </>
  )
}


export default aboutCards;