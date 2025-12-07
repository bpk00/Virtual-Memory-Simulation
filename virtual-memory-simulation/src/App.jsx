import { useState } from 'react'
import pc from './assets/PC.svg'
import error from './assets/Error.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="root" className="flex flex-col p-10 item-center h-screen w-screen">
        {/* Header */}
        <header  id='header' className='text-center mb-6'>
          <p className='text-4xl font-bold text-black'>Virtual Memory Simulation</p>
        </header>

        {/* Input Section */}
        <section id="input" className="flex flex-row justify-center gap-x-20">
          <div id="input-input" className="flex items-center gap-5">
            <p className="font-medium">Logical Address:</p>
            <input
              type="text"
              className="border border-[#164E87] rounded px-2 py-1 bg-[#E5F6FF]"
            />
            <p className="bg-[#75A8DB] text-black text-center px-3 py-1 rounded-full hover:bg-blue-300 transition cursor-pointer">
              Enter
            </p>
          </div>

          <div id="input-reset-btn">
            <p className="bg-[#FFB7B9] text-black px-4 py-1 rounded-full hover:bg-red-300 transition cursor-pointer text-center">
              Reset Simulation
            </p>
          </div>
        </section>

        {/* Content Section - Values */}
        <section id="content-values" className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] items-center justify-center gap-5 pt-10 pb-10">
          {/* Values */}
          <div id="values" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <p className="font-semibold mb-2">Values</p>

            <div className="flex justify-between w-full mb-1">
              <p className="text-[#005E90]">Page Size:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">1024 (1 KB)</p>
            </div>

            <div className="flex justify-between w-full mb-1">
              <p className="text-[#005E90]">Number of Pages:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">8</p>
            </div>

            <div className="flex justify-between w-full">
              <p className="text-[#005E90]">Number of Frames:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">4</p>
            </div>
          </div>

          {/* Output */}
          <div id="output" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <p className="font-semibold mb-2">Output</p>

            <div className="flex justify-between w-full mb-1">
              <p className="text-black">Logical Address:   :</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">3065</p>
            </div>

            <div className="flex justify-between w-full mb-1">
              <p className="text-black">Page Number:</p>
              <p className="px-2 rounded w-[120px] text-center">2</p>
            </div>

            <div className='flex flex-col w-full mb-1'>
              <p className='text-[#900011]'>Page Fault! Page is not loaded.</p>
              <p className='text-[#005E90]'>Loading Page 2 into Frame 3.</p>
            </div>

            <div className="flex justify-between w-full">
              <p className="text-black">Frame Number:</p>
              <p className="px-2 rounded w-[120px] text-center">3</p>
            </div>

             <div className="flex justify-between w-full">
              <p className="text-black">Physical Address:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">4089</p>
            </div>
          </div>

          {/* Page Table */}
          <div id="page-table" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <p className="font-semibold mb-2">Page Table</p>

            <table className='w-full border-collapse rouded-lg overflow-hidden shadow'>
              <thead className='bg-[#164E87] text-white'>
                <tr>
                  <th className='px-4 py-2 border  border-[#005E90]'>Page</th>
                  <th className='px-4 py-2 border  border-[#005E90]'>Frame</th>
                  <th className='px-4 py-2 border  border-[#005E90]'>Assigned or Not</th>
                </tr>
              </thead>

              <tbody>
                {/* Rows 1–7 */}
                {[0,1,2,3,4,5,6,7].map((num) => (
                  <tr key={num} className="text-center">
                    <td className="border border-[#005E90] px-4 py-2">{num}</td>
                    <td className="border border-[#005E90] px-4 py-2">-</td>
                    <td className="border border-[#005E90] px-4 py-2">✔️</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Frame Table */}
          <div id="frame-table" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <p className="font-semibold mb-2">Frame Table</p>

            <table className='w-full border-collapse rouded-lg overflow-hidden'>
              <thead className='text-[#164E87]'>
                <tr>
                  <th className='px-4 py-2'>Frame</th>
                  <th className='px-4 py-2'></th>
                  <th className='px-4 py-2'>Page</th>
                </tr>
              </thead>

              <tbody>
                {/* Rows 1–7 */}
                {[0,1,2,3].map((num) => (
                  <tr key={num} className="text-center">
                    <td className="px-4 py-2"><p className='bg-[#75A8DB] shadow rounded-lg px-2 py-4'>{num}</p></td>
                    <td className="px-4 py-2">➜</td>
                    <td className="px-4 py-2"><p className='bg-[#EFEFEF] shadow rounded-lg px-2 py-4'>✔️</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Next Frame*/}
          <div id="next-frame" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <img src={pc} alt="PC Image" className='w-full p-5'/> 

            <div className="flex justify-between w-full mb-1">
              <p className="text-[#005E90]">Next Available Frame No:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[80px] text-center">3</p>
            </div>

            <div className='flex flex-col w-full mb-1 mt-2'>
              <p className='text-[#900011]'>No Frame Available!</p>
            </div>
          </div>
        </section>

        {/* Content Section - Steps */}
        <section id="content-steps" className="container mx-auto w-full items-center justify-center gap-5 pt-10 pb-10">
          <div id="values" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full">
            <p className="font-semibold mb-2 text-2xl mb-10">Steps</p>
              
            {/* Steps */}
            <div id='steps' className='flex flex-col gap-5 items-center'>
              {/* CPU */}
              <p className='flex justify-center items-center w-[150px] h-[80px] text-xl text-white font-bold shadow rounded-sm bg-[#164E87]'>CPU</p>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* Logical Address*/}
              <div id="values" className="flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 pb-5 w-full gap-2">
                <p className="font-semibold">Logical Address</p>
                <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">3050</p>
              </div>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* MMU */}
              <p className='flex justify-center items-center w-[150px] h-[80px] text-xl text-white font-bold shadow rounded-sm bg-[#164E87]'>MMU</p>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* Calculations for Page no. and Offset*/}
              <div id="values" className="flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 w-full gap-2">
                <p className="font-bold mb-5 mt-5 text-[#164E87] text-lg">Calculating Page no. & Offset</p>

                {/* Page No. */}
                <div className='flex flex-col justify-start gap-2'>
                  <div id="values" className="flex flex-col justify-between items-center w-[310px] md:flex-row gap-2">
                    <p className="font-semibold">Page number:</p>
                    <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">2</p>
                  </div>
                  <div className='flex justify-start items-center w-full'>
                    <div>
                      <p className='text-[#164E87]'>Page Number = Logical Address / Page Size</p>
                      <p className='text-[#164E87] ml-[100px]'>= 3065 / 1024</p>
                      <p className='text-[#164E87] ml-[100px]'>= 2</p>
                    </div>
                  </div>
                </div>

                {/* Offset */}
                <div className='flex flex-col justify-start gap-2'>
                  <div id="values" className="flex flex-col justify-between items-center w-[310px] md:flex-row gap-2">
                    <p className="font-semibold">Offset:</p>
                    <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">2</p>
                  </div>
                  <div className='flex justify-start items-center w-full mb-5'>
                    <div>
                      <p className='text-[#164E87]'>Offset = Logical Address % Page Size</p>
                      <p className='text-[#164E87] ml-[48px]'>= 3065 % 1024</p>
                      <p className='text-[#164E87] ml-[48px]'>= 1017</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* Page Table */}
              <p className='text-center shadow rounded-full text-[#164E87] text-lg font-bold bg-[#164E87]/[0.08] p-1 pl-10 pr-10'>Check Page Table</p>
              <p className='text-center text-4xl font-bold'>↓</p>
              <div className='flex gap-50'>
                <span className="text-center text-4xl font-bold transform rotate-45">↓</span> 
                <span className="text-center text-4xl font-bold transform -rotate-45">↓</span> 
              </div> 

              {/* Page Fault Handling */}
              <div className='flex flex-row w-full gap-10'>
                {/* No Page Fault */}
                <div className='flex flex-col justify-start items-center pl-5 pr-5 bg-blue-100 py-5 rounded-lg w-1/2'>
                  <p className='border border-black rounded-md text-center font-semibold w-1/2 px-10 py-2'>When Page Number is in Page Table</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <p className='bg-[#CFCFCF] py-2 px-5 rounded-md font-semibold text-lg'>No Page Fault</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <div id="values" className="flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 w-full gap-2">
                    {/* Read Frame Number */}
                    <div id="values" className="flex flex-col items-center justify-center p-4 w-full gap-2">
                      <p className="font-semibold">Read Frame Number:</p>
                      <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">3050</p>
                    </div>
                    {/* Address Translation */}
                    <div className='flex flex-col justify-start gap-2'>
                      <p className="font-semibold text-center">Address Translation</p>
                      <div className='flex justify-start items-center w-full'>
                        <div>
                          <p className='text-[#164E87]'>Physical Address = ( Frame Number * Page Size ) + Offset</p>
                          <p className='text-[#164E87] ml-[120px]'>= ( x * x ) + x</p>
                          <p className='text-[#164E87] ml-[120px]'>= x</p>
                        </div>
                      </div>
                    </div>
                    {/* Physical Address */}
                    <div id="values" className="flex flex-col items-center justify-center p-4 w-full gap-2">
                      <p className="font-semibold">Physical Address:</p>
                      <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">3050</p>
                    </div>
                  </div>
                </div>

                {/* Page Fault */}
                <div className='flex flex-col justify-start items-center pl-5 pr-5 bg-blue-100 py-5 rounded-lg w-1/2'>
                  <p className='border border-black rounded-md text-center font-semibold w-1/2 px-10 py-2'>When Page Number is not in Page Table</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <p className='bg-[#FFC5C8] py-2 px-5 rounded-md font-semibold text-lg'>Page Fault</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  {/* OS */}
                  <p className='flex justify-center items-center w-[150px] h-[80px] text-xl text-white font-bold shadow rounded-sm bg-[#164E87]'>OS</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  {/* Check Frame Table */}
                  <p className='text-center shadow rounded-full text-[#164E87] text-lg font-bold bg-[#164E87]/[0.08] p-1 pl-10 pr-10 my-5'>Check Frame Table</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <div className='flex gap-20'>
                    <span className="text-center text-4xl font-bold transform rotate-45">↓</span> 
                    <span className="text-center text-4xl font-bold transform -rotate-45">↓</span> 
                  </div> 
                  {/* Page Fault Handling */}
                  <div className='flex flex-row gap-5 justify-center'>
                    {/* Free Frame Available */}
                    <div id="values" className="flex flex-col items-center justify-start bg-[#EDEDED] rounded-lg p-4 w-1/2 gap-2">
                      <p className='text-center py-2 px-5 border border-black rounded-lg'>Free Frames Available</p>
                      <p className='text-center text-4xl font-bold'>↓</p>
                      <p className='text-center'>Load page to free frame</p>
                      <p className='text-center text-4xl font-bold'>↓</p>
                      <p className='text-center'>Update page table</p>
                      <table className='border border-[#005E90] w-full text-center'>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87] w-1/2">Page</th>
                          <td className="px-4 py-2 border border-[#005E90]">-</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87]">Frame</th>
                          <td className="px-4 py-2 border border-[#005E90]">-</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87]">Assigned or Not</th>
                          <td className="px-4 py-2 border border-[#005E90]">-</td>
                        </tr>
                      </table>                     
                    </div>
                    {/* Free Frames Not Available */}
                    <div id="values" className="flex flex-col items-center justify-start bg-[#EDEDED] rounded-lg p-4 w-1/2 gap-2">
                      <p className='text-center py-2 px-5 border border-black rounded-lg'>Free Frames not Available</p>
                      <p className='text-center text-4xl font-bold'>↓</p>
                      <p className='text-center'>Message:</p>
                      <p className='text-center text-[#900011] font-semibold'>No free frames left! Cannot generate physical address.</p>
                      <img src={error} alt="Error Image" className='w-full my-2'/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
