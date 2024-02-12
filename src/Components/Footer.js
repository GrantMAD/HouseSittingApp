const Footer = () => {
    return (
        <div className="bg-white border-2 border-t-blue-600">
            <div className="max-w-screen-xl px-4 py-6 mx-auto overflow-hidden sm:px-6 lg:px-8">
                <nav className="flex flex-wrap justify-center -mx-2 -my-2">
                    <div className="px-2 py-2">
                        <a href="/" className="text-base leading-6 text-black hover:text-lg font-medium mr-5">
                            Home
                        </a>
                    </div>
                    <div className="px-2 py-2">
                        <a href="/AboutUs" className="text-base leading-6 text-black hover:text-lg font-medium mr-5">
                            About us
                        </a>
                    </div>
                    <div className="px-2 py-2">
                        <a href="/ContactUs" className="text-base leading-6 text-black hover:text-lg font-medium mr-5">
                            Contact us
                        </a>
                    </div>
                    <div className="px-2 py-2">
                        <a href="/Sitters" className="text-base px-3 py-2 rounded-md bg-blue-600 leading-6 text-white hover:text-lg font-medium mr-5">
                            Find a sitter
                        </a>
                    </div>
                </nav>
                <div className="mt-3">
                    <div className="flex justify-center mr-4">
                        <a href="/#" className="hover:text-gray-500">
                            <span className="sr-only">Facebook</span>
                            <svg className="w-6 h-6 fill-blue-600 hover:scale-125" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                    <p className="mt-3 text-base leading-6 text-center text-black font-semibold">
                        © 2023 The House Sitting App Beta. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer;
