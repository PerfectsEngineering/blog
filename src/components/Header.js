import React from 'react';
import { Link } from 'gatsby'
import { Col, Icon, Row } from 'antd'

// Utilities
import { rhythm, scale } from '../utils/typography'
import { toggleDarkOrLightTheme } from '../utils/theme';
import siteConfig from '../../gatsby-config';

// Images
import peLogoExtended from '../img/pe-logo-extended.svg'
  
// Stylesheets
import '../less/Header.less'

const DarkModeSvg = () => (<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
    <g id="Perfects.Engineering-Light-Mode" transform="translate(-977.000000, -77.000000)" stroke="#0A1A1F" stroke-width="2">
        <g id="moon" transform="translate(978.000000, 78.000000)">
            <path d="M18,9.79 C17.5623508,14.5258084 13.5155205,18.1036351 8.76177646,17.9575683 C4.00803241,17.8115015 0.188498486,13.9919676 0.0424317105,9.23822354 C-0.103635065,4.48447948 3.4741916,0.437649222 8.21,-8.8817842e-16 C6.15036193,2.78645171 6.43925659,6.66045319 8.8894017,9.1105983 C11.3395468,11.5607434 15.2135483,11.8496381 18,9.79 Z" id="Path"></path>
        </g>
    </g>
</g>
</svg>)

const LightModeSvg = () => (<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
    <g id="Perfects.Engineering-Dark-Mode" transform="translate(-986.000000, -74.000000)" stroke="#FFFFFF" stroke-width="2">
        <g id="Group-2" transform="translate(987.000000, 71.000000)">
            <g id="sun" transform="translate(0.000000, 4.000000)">
                <circle id="Oval" cx="11" cy="11" r="5"></circle>
                <path d="M11,0 L11,2" id="Path"></path>
                <path d="M11,20 L11,22" id="Path"></path>
                <path d="M3.22,3.22 L4.64,4.64" id="Path"></path>
                <path d="M17.36,17.36 L18.78,18.78" id="Path"></path>
                <path d="M0,11 L2,11" id="Path"></path>
                <path d="M20,11 L22,11" id="Path"></path>
                <path d="M3.22,18.78 L4.64,17.36" id="Path"></path>
                <path d="M17.36,4.64 L18.78,3.22" id="Path"></path>
            </g>
        </g>
    </g>
</g>
</svg>)


export class Header extends React.Component {

  render() {
    const { location, title } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.0),
            marginBottom: rhythm(1.0),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    const socialLink = siteConfig.siteMetadata.social

    return (
      <Row type="flex">
        <Col span={22} offset={1}>
          <Row className="header" type="flex" justify="space-between" align="middle">
            <Col md={12} xs={24} className="logo">
              <Link to={`/`}>
                <img src={peLogoExtended} /> <span>BLOG</span>
              </Link>
            </Col>
            <Col md={12} xs={24}>
              <Row type="flex" justify="end">
                <Col className="social-icons">
                  <Icon component={DarkModeSvg} className="to-dark" onClick={toggleDarkOrLightTheme} />
                  <Icon component={LightModeSvg} className="to-light" onClick={toggleDarkOrLightTheme} />
                  <a href={socialLink.twitter} target="_blank">
                    <Icon type="twitter" />
                  </a>
                  <a href={socialLink.youtube} target="_blank">
                    <Icon type="youtube" theme="filled" />
                  </a>
                  <a href={socialLink.linkedin} target="_blank">
                    <Icon type="linkedin" theme="filled" />
                  </a>
                </Col>
              </Row>
              
            </Col>
            <Col>

            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}