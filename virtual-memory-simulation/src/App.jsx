import { useState } from 'react';
import pc from './assets/PC.svg';
import error from './assets/Error.svg';
import './App.css';

function App() {
  // Constants
  const PAGE_SIZE = 1024;  // Size of each page
  const NUM_PAGES = 8;     // Total number of pages in logical memory
  const NUM_FRAMES = 4;    // Total number of frames in physical memory (RAM)

  // State variables
  const [logicalAddress, setLogicalAddress] = useState(""); // User Input
  const [pageTable, setPageTable] = useState(
    Array.from({ length: NUM_PAGES }, () => ({ frame: "-", assigned: false }))
  );
  const [frameTable, setFrameTable] = useState(
    Array.from({ length: NUM_FRAMES }, () => ({ page: null, occupied: false }))
  );
  const [nextFreeFrame, setNextFreeFrame] = useState(0);
  const [pageFaultMessage, setPageFaultMessage] = useState("");
  const [enteredAddresses, setEnteredAddresses] = useState([]);
  
  // for steps section to highlight active steps
  const [activeStep, setActiveStep] = useState(""); 
  const getHighlight = (id) => {
    return activeStep.includes(id) ? "bg-yellow-100 shadow-xl border border-yellow-500" : "";
  };

  // Function for Enter Btn
  const handleEnter = () => {
    if (!logicalAddress || isNaN(logicalAddress)) return;  // Validate input

    const la = parseInt(logicalAddress);     // Convert input to integer
    const pageNum = Math.floor(la / PAGE_SIZE);  // Calculate page number
    const offset = la % PAGE_SIZE;               // Calculate offset within page
    const maxLogicalAddress = NUM_PAGES * PAGE_SIZE - 1;  // Max allowed logical address

    // Check if userInput exceed MaxLogicalAddress
    if (la > maxLogicalAddress) {
      alert(`Invalid logical address! Maximum allowed is ${maxLogicalAddress}.`);
      return;
    }
    // Check if positive logicalAddress
    if (isNaN(la) || la < 0) {
      alert("Please enter a valid non-negative number.");
      return;
    }

    let frameNum = null;
    let physAddr = null;
    let pageFault = false;
    let pageFaultMsg = "";

    // Make a copy of the arrays
    const newPT = [...pageTable];
    const newFT = [...frameTable];

    // For Steps section to highlight steps
    // Determine which steps are active
    const stepsActive = {
      "logical-address": true,
      "page-number-offset": true,
      "physical-address-calculation": true,
      "no-page-fault": false,
      "page-fault": false,
      "free-frames-available": false,
      "no-free-frames": false,
    };

    // Check if page is already in memory
    if (newPT[pageNum].assigned) {
      // Page already in memory: no page fault
      frameNum = pageTable[pageNum].frame;
      physAddr = frameNum * PAGE_SIZE + offset;
      pageFault = false;
      pageFaultMsg = `Page ${pageNum} is already in memory (Frame ${frameNum}).`;
    
      // Highlight no page fault step
      stepsActive["no-page-fault"] = true;
    } else {
      // Page fault occurs
      pageFault = true;

      // Highlight page fault
      stepsActive["page-fault"] = true;

      if (nextFreeFrame < NUM_FRAMES) {
        // If a free frame is available, load the page
        frameNum = nextFreeFrame;
        physAddr = frameNum * PAGE_SIZE + offset;

        // Update page table and frame table
        newPT[pageNum] = { frame: frameNum, assigned: true };
        newFT[frameNum] = { page: pageNum, occupied: true };
        setPageTable(newPT);
        setFrameTable(newFT);

        // Increment next available frame
        setNextFreeFrame(nextFreeFrame + 1);

        pageFaultMsg = `Page Fault! Page ${pageNum} was not in memory and has been loaded into Frame ${frameNum}.`;

        // Highlight free frame step
        stepsActive["free-frames-available"] = true;
      } else {
        // No free frames available
        pageFaultMsg = `Page Fault! Page ${pageNum} not in memory, but no free frames available.`;

        // Highlight no free frames step
        stepsActive["no-free-frames"] = true;
      }
    }

    // Update active steps in one go
    const activeStepIds = Object.keys(stepsActive).filter(id => stepsActive[id]);
    setActiveStep(activeStepIds); // store as array

    // Display page fault message
    setPageFaultMessage(pageFaultMsg);

    // Save entry in enteredAddresses for display
    setEnteredAddresses(prev => [
      ...prev,
      {
        logicalAddress: la,
        pageNumber: pageNum,
        offset,
        frameNumber: frameNum,
        physicalAddress: physAddr,
        pageFault,
        message: pageFaultMsg,
        assigned: newPT[pageNum].assigned
      },
    ]);

    setLogicalAddress("");  // Clear input field
  };

  // Reset the simulation to initial state
  const resetSimulation = () => {
    setLogicalAddress("");
    setPageTable(Array.from({ length: NUM_PAGES }, () => ({ frame: "-", assigned: false })));
    setFrameTable(Array.from({ length: NUM_FRAMES }, () => ({ page: null, occupied: false })));
    setNextFreeFrame(0);
    setPageFaultMessage("");
    setEnteredAddresses([]);
    setActiveStep("");
  };

  // Last entered address
  const lastEntry = enteredAddresses[enteredAddresses.length - 1] || {};

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
              value={logicalAddress}
              onChange={(e) => setLogicalAddress(e.target.value)}
              className="border border-[#164E87] rounded px-2 py-1 bg-[#E5F6FF]"
            />
            <p className="bg-[#75A8DB] text-black text-center px-3 py-1 rounded-full hover:bg-blue-300 transition cursor-pointer" onClick={handleEnter}>
              Enter
            </p>
          </div>

          <div id="input-reset-btn">
            <p className="bg-[#FFB7B9] text-black px-4 py-1 rounded-full hover:bg-red-300 transition cursor-pointer text-center" onClick={resetSimulation}>
              Reset Simulation
            </p>
          </div>
        </section>

        {/* Content Section - Values */}
        <section id="content-values" className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] items-center justify-center gap-5 pt-10 pb-10">
          {/* Values */}
          <div id="values" className="flex flex-col items-center justify-evenly bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full h-full gap-1">
            <p className="font-semibold mb-2">Values</p>

            <div className="flex justify-between w-full mb-1 items-center">
              <p className="text-[#005E90]">Page Size:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center py-5">1024 (1 KB)</p>
            </div>

            <div className="flex justify-between w-full mb-1 items-center">
              <p className="text-[#005E90]">Number of Pages:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center py-5">8</p>
            </div>

            <div className="flex justify-between w-full items-center">
              <p className="text-[#005E90]">Number of Frames:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center py-5">4</p>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col items-center bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full gap-5">
            <p className="font-semibold mb-2">Output</p>

            <div className="flex justify-between w-full mb-1 items-center">
              <p className="text-black">Logical Address:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center py-5">{lastEntry.logicalAddress ?? "-"}</p>
            </div>

            <div className="flex justify-between w-full mb-1">
              <p className="text-black">Page Number:</p>
              <p className="px-2 rounded w-[120px] text-center">{lastEntry.pageNumber ?? "-"}</p>
            </div>

            <div className="flex justify-between w-full mb-1">
              <p className="text-black">Offset:</p>
              <p className="px-2 rounded w-[120px] text-center">{lastEntry.offset ?? "-"}</p>
            </div>

            {/* Message */}
            <div className='flex flex-col justify-start w-full'>
              {pageFaultMessage && <p className="text-[#900011]">{pageFaultMessage}</p>}

              {lastEntry.frameNumber !== null && lastEntry.pageFault && (
                <p className="text-[#005E90]">
                  Loading Page {lastEntry.pageNumber} into Frame {lastEntry.frameNumber}.
                </p>
              )}
            </div>

            <div className="flex justify-between w-full">
              <p className="text-black">Frame Number:</p>
              <p className="px-2 rounded w-[120px] text-center">{lastEntry.frameNumber ?? "-"}</p>
            </div>

            <div className="flex justify-between w-full items-center">
              <p className="text-black">Physical Address:</p>
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center py-5">{lastEntry.physicalAddress ?? "-"}</p>
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
                {pageTable.map((entry, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-[#005E90] px-4 py-2">{index}</td>
                    <td className="border border-[#005E90] px-4 py-2">{entry.assigned ? entry.frame : "-"}</td>
                    <td className="border border-[#005E90] px-4 py-2">{entry.assigned ? "✔️" : "❌"}</td>
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
                {frameTable.map((entry, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-4 py-2">
                      <p className='bg-[#75A8DB] shadow rounded-lg px-2 py-4'>{index}</p>
                    </td>
                    <td className="px-4 py-2">➜</td>
                    <td className="px-4 py-2">
                      <p className='bg-[#EFEFEF] shadow rounded-lg px-2 py-4'>
                        {entry.occupied ? entry.page : "-"}
                      </p>
                    </td>
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
              <p className="bg-[#E5F6FF] shadow px-2 rounded w-[80px] text-center">
                {nextFreeFrame < NUM_FRAMES ? nextFreeFrame : "None"}
              </p>
            </div>
          </div>
        </section>

        {/* Entered Logical Addresses */}
        <section className="flex flex-col items-center bg-[#EDEDED]/[0.59] rounded-lg p-4 w-full">
          <p className="font-semibold mb-2">Entered Logical Addresses</p>
          <table className='w-full border-collapse rounded-lg overflow-hidden shadow'>
            <thead className='bg-[#164E87] text-white'>
              <tr>
                <th className='px-4 py-2 border border-[#005E90]'>Logical Address</th>
                <th className='px-4 py-2 border border-[#005E90]'>Page Number</th>
                <th className='px-4 py-2 border border-[#005E90]'>Offset</th>
                <th className='px-4 py-2 border border-[#005E90]'>Page Fault</th>
                <th className='px-4 py-2 border border-[#005E90]'>Frame Number</th>
                <th className='px-4 py-2 border border-[#005E90]'>Physical Address</th>
                <th className='px-4 py-2 border border-[#005E90]'>Message</th>
              </tr>
            </thead>
            <tbody>
              {enteredAddresses.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-[#005E90] px-4 py-2 font-bold">{entry.logicalAddress}</td>
                  <td className="border border-[#005E90] px-4 py-2">{entry.pageNumber}</td>
                  <td className="border border-[#005E90] px-4 py-2">{entry.offset}</td>
                  <td className="border border-[#005E90] px-4 py-2">{entry.pageFault ? "✔️" : "❌"}</td>
                  <td className="border border-[#005E90] px-4 py-2">{entry.frameNumber ?? "-"}</td>
                  <td className="border border-[#005E90] px-4 py-2 font-bold">{entry.physicalAddress ?? "-"}</td>
                  <td className="border border-[#005E90] px-4 py-2">{entry.message ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div id='logical-address' className={`flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 pb-5 w-full gap-2 ${getHighlight("logical-address")}`}>
                <p className="font-semibold">Logical Address</p>
                <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">{lastEntry.logicalAddress ?? "-"}</p>
              </div>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* MMU */}
              <p className='flex justify-center items-center w-[150px] h-[80px] text-xl text-white font-bold shadow rounded-sm bg-[#164E87]'>MMU</p>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* Calculations for Page no. and Offset*/}
              <div id='page-number-offset' className={`flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 w-full gap-2 ${getHighlight("page-number-offset")}`}>
                <p className="font-bold mb-5 mt-5 text-[#164E87] text-lg">Calculating Page no. & Offset</p>

                {/* Page No. */}
                <div className='flex flex-col justify-start gap-2'>
                  <div className="flex flex-col justify-between items-center w-[310px] md:flex-row gap-2">
                    <p className="font-semibold">Page number:</p>
                    <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">{lastEntry.pageNumber ?? "-"}</p>
                  </div>
                  <div className='flex justify-start items-center w-full'>
                    <div>
                      <p className='text-[#164E87]'>Page Number = Logical Address / Page Size</p>
                      <p className='text-[#164E87] ml-[100px]'>= {lastEntry.logicalAddress ?? "-"} / {PAGE_SIZE ?? "-"}</p>
                      <p className='text-[#164E87] ml-[100px]'>= {lastEntry.pageNumber ?? "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Offset */}
                <div className='flex flex-col justify-start gap-2'>
                  <div id="values" className="flex flex-col justify-between items-center w-[310px] md:flex-row gap-2">
                    <p className="font-semibold">Offset:</p>
                    <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">{lastEntry.offset ?? "-"}</p>
                  </div>
                  <div className='flex justify-start items-center w-full mb-5'>
                    <div>
                      <p className='text-[#164E87]'>Offset = Logical Address % Page Size</p>
                      <p className='text-[#164E87] ml-[48px]'>= {lastEntry.logicalAddress ?? "-"} % {PAGE_SIZE ?? "-"}</p>
                      <p className='text-[#164E87] ml-[48px]'>= {lastEntry.offset ?? "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-center text-4xl font-bold'>↓</p>

              {/* Check Page Table */}
              <p className='text-center shadow rounded-full text-[#164E87] text-lg font-bold bg-[#164E87]/[0.08] p-1 pl-10 pr-10'>Check Page Table</p>
              <p className='text-center text-4xl font-bold'>↓</p>
              <div className='flex gap-50'>
                <span className="text-center text-4xl font-bold transform rotate-45">↓</span> 
                <span className="text-center text-4xl font-bold transform -rotate-45">↓</span> 
              </div> 

              {/* Page Fault Handling */}
              <div className='flex flex-row w-full gap-10'>
                {/* No Page Fault */}
                <div id='no-page-fault' className={`flex flex-col justify-start items-center pl-5 pr-5 bg-blue-100 py-5 rounded-lg w-1/2 ${getHighlight("no-page-fault")}`}>
                  <p className='border border-black rounded-md text-center font-semibold w-1/2 px-10 py-2'>When Page Number is in Page Table</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <p className='bg-[#CFCFCF] py-2 px-5 rounded-md font-semibold text-lg'>No Page Fault</p>
                  <p className='text-center text-4xl font-bold'>↓</p>
                  <div id='physical-address-calculation' className={`flex flex-col items-center justify-center bg-[#EDEDED] rounded-lg p-4 w-full gap-2 ${getHighlight("physical-address-calculation")}`}>
                    {/* Read Frame Number */}
                    <div className="flex flex-col items-center justify-center p-4 w-full gap-2">
                      <p className="font-semibold">Read Frame Number:</p>
                      <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">{lastEntry.frameNumber ?? "-"}</p>
                    </div>
                    {/* Address Translation */}
                    <div className='flex flex-col justify-start gap-2'>
                      <p className="font-semibold text-center">Address Translation</p>
                      <div className='flex justify-start items-center w-full'>
                        <div>
                          <p className='text-[#164E87]'>Physical Address = ( Frame Number * Page Size ) + Offset</p>
                          <p className='text-[#164E87] ml-[120px]'>= ( {lastEntry.frameNumber ?? "-"} * {PAGE_SIZE ?? "-"} ) + {lastEntry.offset ?? "-"}</p>
                          <p className='text-[#164E87] ml-[120px]'>= {lastEntry.physicalAddress ?? "-"}</p>
                        </div>
                      </div>
                    </div>
                    {/* Physical Address */}
                    <div className="flex flex-col items-center justify-center p-4 w-full gap-2">
                      <p className="font-semibold">Physical Address:</p>
                      <p className="bg-[#E5F6FF] shadow px-2 rounded w-[120px] text-center">{lastEntry.physicalAddress ?? "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Page Fault */}
                <div id='page-fault' className={`flex flex-col justify-start items-center pl-5 pr-5 bg-blue-100 py-5 rounded-lg w-1/2' ${getHighlight("page-fault")}`}>
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
                    <div id='free-frames-available' className={`flex flex-col items-center justify-start bg-[#EDEDED] rounded-lg p-4 w-1/2 gap-2 ${getHighlight("free-frames-available")}`}>
                      <p className='text-center py-2 px-5 border border-black rounded-lg'>Free Frames Available</p>
                      <p className='text-center text-4xl font-bold'>↓</p>
                      <p className='text-center'>Load page to free frame</p>
                      <p className='text-center text-4xl font-bold'>↓</p>
                      <p className='text-center'>Update page table</p>
                      <table className='border border-[#005E90] w-full text-center'>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87] w-1/2">Page</th>
                          <td className="px-4 py-2 border border-[#005E90]">{lastEntry.pageNumber ?? "-"}</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87]">Frame</th>
                          <td className="px-4 py-2 border border-[#005E90]">{lastEntry.frameNumber ?? "-"}</td>
                        </tr>
                        <tr>
                          <th className="px-4 py-2 border border-[#005E90] text-white bg-[#164E87]">Assigned or Not</th>
                          <td className="px-4 py-2 border border-[#005E90]">{lastEntry.assigned ? "✔️" : "❌"}</td>
                        </tr>
                      </table>                     
                    </div>
                    {/* Free Frames Not Available */}
                    <div id='no-free-frames' className={`flex flex-col items-center justify-start bg-[#EDEDED] rounded-lg p-4 w-1/2 gap-2 ${getHighlight("no-free-frames")}`}>
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
