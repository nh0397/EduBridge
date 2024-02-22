import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Homepage/Home';
import IndividualPage from './components/AboutPage/IndividualPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <ScrollToTop />
                <div className='pages'>
                    <Routes>
                        <Route
                            path = "/"
                            element = {<Home />}
                        >
                        </Route>
                        <Route
                            path = "/about/:name"
                            element = {<IndividualPage />}
                        >
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;