import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {SORTING_OPTIONS} from '../../constants/sorting-options';
import {getCurrentPlaces} from '../../reducer/data/selectors';


/**
 * Helper for sorting
 * @param {Node} Component
 * @return {*}
 */
const withSorting = (Component) => {

  class WithSorting extends React.PureComponent {

    constructor(props) {
      super(props);

      this.state = {
        activeOption: null,
        options: SORTING_OPTIONS,
        sortingPlaces: this.props.places
      };

      this.state.activeOption = this.state.options.find((option) => option.id === `popular`);
      this._onChange = this._onChange.bind(this);
    }

    render() {
      return <Component
        {...this.props}
        activeOption={this.state.activeOption}
        onChange={this._onChange}
        options={this.state.options}
        sortingPlaces={this.state.sortingPlaces}
      />;
    }

    /**
     * Method is invoked when component is updated
     * Updated sortingPLaces when places was loaded
     */
    componentDidUpdate() {
      if (this.state.sortingPlaces.length === 0) {
        this.setState(Object.assign({}, this.state, {
          sortingPlaces: this.props.places
        }));
      }
    }

    /**
     * Update sorting
     * @param {String} id
     * @private
     */
    _onChange(id) {
      const filteredPlaces = this._filterPlaces(id);

      this.setState(Object.assign({}, this.state, {
        activeOption: this.state.options.find((option) => option.id === id),
        sortingPlaces: filteredPlaces
      }));
    }

    /**
     * Filter places
     * @param {String} id
     * @private
     * @return {Object}
     */
    _filterPlaces(id) {
      const filteredPlaces = Array.from(this.props.places);

      switch (id) {
        case `low-to-high`: {
          filteredPlaces.sort((place1, place2) => place1.price - place2.price);
          break;
        }

        case `high-to-low`: {
          filteredPlaces.sort((place1, place2) => place2.price - place1.price);
          break;
        }

        case `rating`: {
          filteredPlaces.sort((place1, place2) => place2.rating - place1.rating);
          break;
        }

        default: {
          return filteredPlaces;
        }
      }

      return filteredPlaces;
    }
  }

  WithSorting.propTypes = {
    places: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
    })).isRequired
  };

  return WithSorting;
};


const mapStateToProps = (state, ownProps) => Object.assign({}, ownProps, {
  places: getCurrentPlaces(state),
});


export {withSorting};

export default compose(connect(mapStateToProps), withSorting);
