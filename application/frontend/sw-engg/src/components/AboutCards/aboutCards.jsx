import React, { useEffect } from 'react';
import './aboutCards.scss';
import {Link} from "react-router-dom";



const aboutCards = (props) =>{
  console.log(props.details)
  return (
      <>
          <div class="responsive-cell-block wk-desk-3 wk-ipadp-3 wk-tab-6 wk-mobile-12 team-card-container">
            <div class="team-card">
              <Link to={`/about/${props.details.name.replace(' ', '-')}`} state={{ profile: props.details }}>
              <div class="img-wrapper">
                <img class="team-img" src= {props.details.picture_source}/>
              </div>
              <div className='centerAlign'>
              <p class="text-blk name">
                {props.details.name}
              </p>
              <p class="text-blk position">
                {props.details.role}
              </p>
              </div>
              </Link>
              <div class="social-media-links">
                <a href={props.details.instagram_id} target="_blank">
                  <img src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-insta.svg"/>
                </a>
                <a href={"mailto:" + props.details.email_id} target="_blank">
                  <img src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-mail.svg"/>
                </a>
              </div>
            </div>
          </div>
      </>
  )
}


export default aboutCards;