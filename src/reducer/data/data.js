import PlacesParser from '../../utils/places-parser';
import CommentsParser from '../../utils/comments-parser';


const initialState = {
  city: `Amsterdam`,
  comments: [],
  errorCommentsSend: null,
  isCommentSending: false,
  places: []
};


const ActionType = {
  CHANGE_CITY: `CHANGE_CITY`,
  CHANGE_COMMENT_SENDING_STATUS: `CHANGE_COMMENT_SENDING_STATUS`,
  LOAD_COMMENTS: `LOAD_COMMENTS`,
  LOAD_PLACES: `LOAD_PLACES`,
  POST_COMMENT: `POST_COMMENT`,
  SET_COMMENT_SEND_ERROR: `SET_COMMENT_SEND_ERROR`,
  UPDATE_PLACE: `UPDATE_PLACE`,
};


/**
 * Methods that returns actions for reducer (Object with type and payload params)
 * @return {Object}
 */
const ActionCreator = {
  changeCity: (city) => ({
    type: ActionType.CHANGE_CITY,
    payload: city
  }),

  changeCommentSendingStatus: (status) => ({
    type: ActionType.CHANGE_COMMENT_SENDING_STATUS,
    payload: status
  }),

  loadComments: (comments) => ({
    type: ActionType.LOAD_COMMENTS,
    payload: comments,
  }),

  loadPlaces: (places) => ({
    type: ActionType.LOAD_PLACES,
    payload: places,
  }),

  postComment: (comments) => ({
    type: ActionType.POST_COMMENT,
    payload: comments,
  }),

  setCommentSendError: (error) => ({
    type: ActionType.SET_COMMENT_SEND_ERROR,
    payload: error
  }),

  updatePlace: (place) => ({
    type: ActionType.UPDATE_PLACE,
    payload: place,
  })
};


const Operation = {
  loadComments: (id) => (dispatch, _getState, api) => {
    return api.get(`/comments/${id}`)
      .then((response) => {
        dispatch(ActionCreator.loadComments(CommentsParser.parseComments(response.data)));
      });
  },

  loadPlaces: () => (dispatch, _getState, api) => {
    return api.get(`/hotels`)
      .then((response) => {
        dispatch(ActionCreator.loadPlaces(PlacesParser.parsePlaces(response.data)));
      });
  },

  sendComments: (id, data) => (dispatch, _getState, api) => {
    return api.post(`/comments/${id}`, data)
      .then((response) => {
        dispatch(ActionCreator.postComment(CommentsParser.parseComments(response.data)));
        dispatch(ActionCreator.changeCommentSendingStatus(false));
      })
      .catch((err) => {
        const commentError = (err.response && err.response.data) || {};
        dispatch(ActionCreator.setCommentSendError(commentError.error || err.message));
      });
  },

  setFavorite: (place) => (dispatch, _getState, api) => {
    const id = place.id;
    const status = place.isFavorite ? `0` : `1`;

    return api.post(`/favorite/${id}/${status}`)
      .then((response) => {
        dispatch(ActionCreator.updatePlace(PlacesParser.parsePlaces(response.data)));
      })
      .catch((err) => {
        throw err;
      });
  },
};


/**
 * Reducer for change application state
 * @param {Object} state [state = initialState]
 * @param {Object} action
 * @param {String} action.type
 * @return {Object}
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.CHANGE_CITY:
      return Object.assign({}, state, {
        city: action.payload,
      });

    case ActionType.CHANGE_COMMENT_SENDING_STATUS:
      return Object.assign({}, state, {
        isCommentSending: action.payload,
      });

    case ActionType.LOAD_COMMENTS:
      return Object.assign({}, state, {
        comments: action.payload,
      });

    case ActionType.LOAD_PLACES:
      return Object.assign({}, state, {
        places: action.payload,
      });

    case ActionType.POST_COMMENT:
      return Object.assign({}, state, {
        comments: action.payload,
      });

    case ActionType.SET_COMMENT_SEND_ERROR:
      return Object.assign({}, state, {
        errorCommentsSend: action.payload,
      });

    case ActionType.UPDATE_PLACE:
      return Object.assign({}, state, {
        places: state.places.map((place) => {
          if (place.id === action.payload.id) {
            return action.payload;
          }
          return place;
        })
      });
  }

  return state;
};


export {
  ActionCreator,
  ActionType,
  Operation,
  reducer
};
