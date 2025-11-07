import React from 'react'
import { footerInfo, socialIcon } from '../../constants'

const Footer = () => {
    return (
        <div className='pt-9 bg-footer bg-center'>
            <footer className='container mx-auto wrapper '>
                <h1 className=' text-white pt-10 px-4 w-full text-center'>We are ready to have you best the best dining experiences.</h1>

                <div className=" grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-10">
                    {footerInfo.map(({ img, title, desc1, desc2 }, index) => (
                        <div className="center flex-col text-white mb-5" key={index}>
                            <img src={img} alt="" />
                            <h3 className=" text-lg text my-2 font-bebus tracking-wider">
                                {title}
                            </h3>
                            <p className=" text-xs font-poppins">{desc1}</p>
                            <p className=" text-xs font-poppins">{desc2}</p>
                        </div>
                    ))}
                </div>


                <div className="center flex-col pt-14 pb-10 gap-4">
                <div className=' center gap-3  '>
                    {socialIcon.map((icon, index) => (
                        <img key={index} src={icon} alt={`social-icon-${index}`} />
                    ))}
                </div>
                <div className="text-white">© 2025 All Rights Reserved</div>
                </div>
            </footer>

        </div>
    )
}

export default Footer
