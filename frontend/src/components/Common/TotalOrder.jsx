import React from 'react'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const TotalOrder = () => {
    const { items } = useSelector((state) => state.cart)
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/checkout')
    }
  return (
   <div className={`relative w-fit cursor-pointer ${items.length === 0? 'hidden' : 'block'}`} onClick={handleClick}>
     <svg
    fill="#000000"
    height="60px"
    width="60px"
    id="Layer_1"
    viewBox="0 0 503.467 503.467"
    xmlSpace="preserve"
    sodipodi:docname="plate.svg"
    inkscape:version="1.2.2 (732a01da63, 2022-12-09)"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"

  >
    <defs id="defs44379" />
    <sodipodi:namedview
      id="namedview44377"
      pagecolor="#505050"
      bordercolor="#eeeeee"
      borderopacity={1}
      inkscape:showpageshadow={0}
      inkscape:pageopacity={0}
      inkscape:pagecheckerboard={0}
      inkscape:deskcolor="#505050"
      showgrid="false"
      inkscape:zoom={0.4870198}
      inkscape:cx={937.33355}
      inkscape:cy={513.32615}
      inkscape:window-width={1366}
      inkscape:window-height={705}
      inkscape:window-x={-8}
      inkscape:window-y={32}
      inkscape:window-maximized={1}
      inkscape:current-layer="Layer_1"
    />
    <path
      d="m 76.8,51.2 c -4.719,0 -8.533,3.823 -8.533,8.533 V 153.6 c 0,11.11 -7.159,20.489 -17.067,24.03 V 59.733 c 0,-4.71 -3.814,-8.533 -8.533,-8.533 -4.719,0 -8.533,3.823 -8.533,8.533 V 177.621 C 24.227,174.088 17.067,164.71 17.067,153.6 V 59.733 C 17.067,55.023 13.253,51.2 8.534,51.2 3.815,51.2 0,55.023 0,59.733 V 153.6 c 0,20.599 14.686,37.837 34.133,41.805 v 44.74 c -14.677,3.814 -25.6,17.058 -25.6,32.922 v 153.6 c 0,18.816 15.309,34.133 34.133,34.133 18.824,0 34.134,-15.317 34.134,-34.133 v -153.6 c 0,-15.863 -10.923,-29.107 -25.6,-32.922 v -44.74 C 70.647,191.437 85.333,174.2 85.333,153.6 V 59.733 C 85.333,55.023 81.519,51.2 76.8,51.2 Z M 42.667,315.733 c -4.71,0 -8.533,-3.823 -8.533,-8.533 0,-4.71 3.823,-8.533 8.533,-8.533 4.71,0 8.533,3.823 8.533,8.533 0,4.71 -3.823,8.533 -8.533,8.533 z"
      id="path44362"
      style={{
        fill: "#ffffff",
      }}
    />
    <path
      d="M 486.4,243.678 V 51.2 c 0,-3.448 -2.074,-6.562 -5.265,-7.885 -3.183,-1.314 -6.861,-0.597 -9.301,1.852 -23.629,23.62 -36.634,55.031 -36.634,88.439 v 52.215 c 0,19.32 4.565,38.656 13.201,55.927 l 1.613,3.226 c -8.934,6.161 -14.814,16.444 -14.814,28.092 v 153.6 c 0,18.816 15.309,34.133 34.133,34.133 18.824,0 34.133,-15.317 34.133,-34.133 v -153.6 C 503.467,260.488 496.555,249.6 486.4,243.678 Z M 452.267,133.606 c 0,-21.009 5.956,-41.096 17.067,-58.342 v 163.669 h -3.26 l -2.406,-4.813 c -7.458,-14.916 -11.401,-31.616 -11.401,-48.299 z m 17.066,182.127 c -4.71,0 -8.533,-3.823 -8.533,-8.533 0,-4.71 3.823,-8.533 8.533,-8.533 4.71,0 8.533,3.823 8.533,8.533 0,4.71 -3.822,8.533 -8.533,8.533 z"
      id="path44364"
      style={{
        fill: "#ffffff",
      }}
    />
    <circle
      style={{
        opacity: 1,
        fill: "#ffffff",
        fillOpacity: 1,
        strokeWidth: 1.41862,
      }}
      id="path44574"
      cx={255.78035}
      cy={287.82596}
      r={144.36987}
    />
    {/* <text
      xmlSpace="preserve"
      style={{
        fontStyle: "normal",
        fontVariant: "normal",
        fontWeight: "normal",
        fontStretch: "normal",
        fontSize: "152.531px",
        fontFamily: "'Bauhaus 93'",
        InkscapeFontSpecification: "'Bauhaus 93, Normal'",
        fontVariantLigatures: "normal",
        fontVariantCaps: "normal",
        fontVariantNumeric: "normal",
        fontVariantEastAsian: "normal",
        fill: "#ff0000",
        strokeWidth: 56.3982,
      }}
      x={157.58107}
      y={338.65723}
      id="text45244"
    >
      <tspan
        sodipodi:role="line"
        id="tspan45242"
        style={{
          fontStyle: "normal",
          fontVariant: "normal",
          fontWeight: "normal",
          fontStretch: "normal",
          fontSize: "152.531px",
          fontFamily: "'Bauhaus 93'",
          InkscapeFontSpecification: "'Bauhaus 93, Normal'",
          fontVariantLigatures: "normal",
          fontVariantCaps: "normal",
          fontVariantNumeric: "normal",
          fontVariantEastAsian: "normal",
          fill: "#ff0000",
          strokeWidth: 56.3982,
        }}
        x={157.58107}
        y={338.65723}
        className='center'
      >
        {orders.length}
      </tspan>
    </text> */}
  </svg>
  <span className="absolute  text-sm right-0 left-0 top-6 text-red-600 font-bold text-center  w-full">{items.length}</span>

   </div>
  )
}

export default TotalOrder

