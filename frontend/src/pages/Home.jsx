import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-primary text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Welcome to <span className="text-accent">Dishari Physics Academy</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
                        Empowering students with deep conceptual understanding and problem-solving skills in Physics. Join us to excel in your academic journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/login" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-blue-600 md:text-lg transition-colors">
                            Student Login
                        </Link>
                        <Link to="/about" className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-white hover:bg-white hover:text-primary md:text-lg transition-colors">
                            Learn More
                        </Link>
                    </div>
                </div>
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Choose DPA?</h2>
                        <p className="mt-4 text-lg text-gray-600">We provide a comprehensive learning environment tailored for success.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-primary font-bold text-xl">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Guidance</h3>
                            <p className="text-gray-600">Learn from experienced faculty dedicated to clarifying complex concepts.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-primary font-bold text-xl">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Assessments</h3>
                            <p className="text-gray-600">Weekly exams and assignments to track progress and identify areas for improvement.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-primary font-bold text-xl">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Learning</h3>
                            <p className="text-gray-600">Access assignments, results, and resources online through our student portal.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
