import "../index.css";

const AboutUs = () => {

    return (
        <div className="bg-gradient-to-r from-green-400 via-cyan-900 to-blue-700 md:p-10 lg:pt-24 lg:pb-24 lg:px-10">
            <div className="flex justify-center pt-20 md:pt-10">
                <h1 className="text-3xl md:text-4xl text-white font-semibold underline underline-offset-8 decoration-2 decoration-white">About us</h1>
            </div>
            <div className="flex lg:flex-row md:flex-col flex-col px-[20%]">
                <div className="lg:w-1/2 md:w-full text-white">
                    <h1 className="grid text-2xl place-content-center font-semibold underline underline-offset-8 decoration-2 decoration-white mb-6 mt-10">Our Vision</h1>
                    <p className="text-center mb-10">At HouseSittingApp, our vision is to create a trusted community where homeowners find peace of mind, and reliable sitters discover opportunities to care for homes with passion and integrity.</p>
                    <h1 className="grid text-2xl place-content-center font-semibold underline underline-offset-8 decoration-2 decoration-white mb-6">Our Mission</h1>
                    <p className="text-center mb-10">Our mission at HouseSittingApp is to empower homeowners by connecting them with dedicated and responsible sitters, fostering a network that prioritizes safety, reliability, and personalized care for every home.</p>
                    <h1 className="grid text-2xl place-content-center font-semibold underline underline-offset-8 decoration-2 decoration-white mb-6">Our Values</h1>
                    <p className="text-center mb-10">At HouseSittingApp, our values form the bedrock of our community. We prioritize trustworthiness, forging connections based on transparency and accountability. Reliability is paramount, ensuring homeowners find dependable sitters committed to the highest standards of care. Our sense of community celebrates diversity, creating a network that feels like a trusted family. Safety is non-negotiable—we implement rigorous screening processes and provide resources for secure environments. We champion responsibility, encouraging both sitters and homeowners to share in the commitment to fostering positive house sitting experiences. Through our dedication to innovation, we continually strive to redefine and elevate the standards of house sitting in the modern age.</p>
                    <h1 className="grid text-2xl place-content-center font-semibold underline underline-offset-8 decoration-2 decoration-white mb-6 mt-10">Objectives</h1>
                    <p className="text-center mb-10">Our core objectives at HouseSittingApp revolve around creating a seamless and satisfying experience for our users. We prioritize user satisfaction, continually refining our platform based on feedback to ensure an intuitive and efficient process for homeowners and sitters alike. Expansion is a key goal, aiming to connect more homeowners with reliable sitters globally, fostering a diverse and vibrant community. Our commitment to safety remains unwavering, with ongoing efforts to enhance security protocols, ensuring a trustworthy environment for all users. Embracing technological advancements is pivotal, as we seek to leverage cutting-edge solutions for a more streamlined and enjoyable house sitting experience. Lastly, we aim to promote responsible practices, educating and empowering our community to approach house sitting with a sense of responsibility, contributing to positive and mutually beneficial interactions for homeowners and sitters.</p>
                    {/*
                    <hr className="border-1.5 border-black" />
                    <div class="flex justify-around mt-10">
                        <img class="w-10 h-10" src="/images/sponsor-1.png" alt=""></img>
                        <img class="w-10 h-10" src="/images/sponsor-2.png" alt=""></img>
                        <img class="w-10 h-10" src="/images/sponsor-3.png" alt=""></img>
                        <img class="w-10 h-10" src="/images/sponsor-4.png" alt=""></img>
                    </div>
    */}
                </div>
                <div className="flex justify-center items-center lg:w-1/2">
                    <img className="pl-4 drop-shadow-2xl h-96 w-96 object-contain" src="/images/Landingpageimage.png" alt=""></img>
                </div>
            </div>
        </div >
    )
}
export default AboutUs;