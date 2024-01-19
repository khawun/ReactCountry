// src/components/Country.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const itemsPerPage = 25;

const Country: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((country) =>
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const nameA = a.name.official.toLowerCase();
    const nameB = b.name.official.toLowerCase();

    if (sortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleCountryClick = (country: any) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const handleCloseModal = () => {
    setSelectedCountry(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const paginationsty = {
    display: 'flex',
    alignItems: 'center',  // Vertical centering
    justifyContent: 'center',  // Horizontal centering
    // Add more style properties as needed
  }; 


  const  titleSearchSortsty= {
    display: 'flex',
    flexDirection: 'column',  // Change from row to column
    alignItems: 'center',  // Vertical centering
    justifyContent: 'center',  // Horizontal centering
    // Add more style properties as needed
  }; 


    const modalOverlayStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
    };
    
    const modalContentStyle = {
        background: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '100%',
        boxSizing: 'border-box',
    };
  

  return (
    <div>
        <div>
            {isModalOpen && (
            <div style={modalOverlayStyle} className="modal-overlay">
                <div style={modalContentStyle} className="modal-content">
                <button onClick={handleCloseModal} className="close-button">
                    Close
                </button>
                <h2>{selectedCountry?.name.official}</h2>
                {selectedCountry?.flags && selectedCountry?.flags.png ? (
                        <img src={selectedCountry?.flags.png} alt={`${selectedCountry?.name.official} Flag`} className="flag-img" />
                        ) : (
                        'N/A'
                        )}
                <p>{selectedCountry?.cca2}</p>
                <p>{selectedCountry?.cca3}</p>
                {/* ... rest of your modal content ... */}
                </div>
            </div>
            )}
            {/* ... rest of your component ... */}
        </div>
        <div style={titleSearchSortsty}>
            <h1>Country List</h1>
            <div>
                <label>Search By name</label>
                <input
                    type="text"
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                    }}
                />
                <label>
                    Sort by Name:
                    <select
                    value={sortOrder}
                    onChange={(e) => {
                        setCurrentPage(1);
                        setSortOrder(e.target.value as 'asc' | 'desc');
                    }}
                    >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
        </div>
        <div>
            <table>
                <thead>
                <tr>
                    <th>Flage && Name</th>
                    <th>2 character Country Code</th>
                    <th>2 character Country Code</th>
                    <th>Native Country Name</th>
                    <th>Alternative Country Name</th>
                    <th>Country Calling Codes</th>
                    {/* Add more table headers as needed */}
                </tr>
                </thead>
                <tbody>
                {currentItems.map((country) => (
                    <tr key={country.cca3}>
                        <td>
                        <h2><button onClick={() => handleCountryClick(country)}>
                  {country.name.official}
                </button></h2>
                        {country.flags && country.flags.png ? (
                        <img src={country.flags.png} alt={`${country.name.official} Flag`} className="flag-img" />
                        ) : (
                        'N/A'
                        )}
                    </td>
                    <td>{country.cca2}</td>
                    <td>{country.cca3}</td>
                    <td>{JSON.stringify(country.name.nativeName, null, 2)}</td>
                    <td>{JSON.stringify(country.altSpellings, null, 2)}</td>
                    <td>{JSON.stringify(country.idd, null, 2)}</td>
                    {/* Add more table cells with other data as needed */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        
        <div style={paginationsty}>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <div>Page {currentPage} of {totalPages}</div>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
        
    </div>
  );
};

export default Country;
