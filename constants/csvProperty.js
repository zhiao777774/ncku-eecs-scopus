import PropTypes from 'prop-types';

const CsvDataType = PropTypes.shape({
    author: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.arrayOf(PropTypes.string).isRequired]),
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    publication: PropTypes.string.isRequired,
    TimesCited: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    abstract: PropTypes.string.isRequired,
    keyword: PropTypes.arrayOf(PropTypes.string).isRequired,
    documentType: PropTypes.string.isRequired,
    stage: PropTypes.string.isRequired,
    OpenAccess: PropTypes.arrayOf(PropTypes.string).isRequired,
    EID: PropTypes.string.isRequired
}).isRequired;

const CsvFileMap = {
    csie: 'data/scopus/電資學院近三年出版-資訊領域(含醫資).csv',
    ime: 'data/scopus/電資學院近三年出版-微電子領域(含奈米).csv',
    ee: 'data/scopus/電資學院近三年出版-電機領域.csv',
    cce: 'data/scopus/電資學院近三年出版-電通領域.csv',
    imis: 'data/scopus/電資學院近三年出版-製造領域.csv'
};

export {CsvDataType, CsvFileMap};