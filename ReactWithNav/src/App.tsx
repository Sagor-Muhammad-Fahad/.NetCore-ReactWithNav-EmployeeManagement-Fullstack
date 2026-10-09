
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css'

import { MainLayout } from './components/MainLayout';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';



export const App:React.FC=()=>{
  return(
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path='/' element={<Navigate to="/employees" replace/>}/>
      <Route path='/employees' element={<EmployeeList/>}/>
        <Route path='/employees/create' element={<EmployeeForm/>}/>
         <Route path='/employees/edit/:id' element={<EmployeeForm/>}/>
          <Route path='*' element={<Navigate to="/employees" replace/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
};
export default App


