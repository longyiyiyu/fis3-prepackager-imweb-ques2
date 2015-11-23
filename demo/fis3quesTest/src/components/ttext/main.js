/**
 * ## Ttext Component
 *
 * just a text node
 * @component ttext
 */
module.exports = {
    /**
     * ```
     * {
     *      text: 'Hello'
     * }
     * ```
     *
     * @mock
     */
    data: {
        /**
         * @property {String} text - which message will show
         */
        text: undefined,
    },
    filters: {
        capitalize: function(value) {
            if (!value && value !== 0) {
                return '';
            }
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
};
