import React, { forwardRef } from 'react';
import TextFilter from './TextFilter';
import SelectFilter from './SelectFilter';

const Filter = forwardRef(function Filter({ item, applyFilter }, ref) {
  const filterable = item.filterable;
  return (
    <td className="py-1 pl-6">
      {filterable && filterable.type === 'text' && (
        <TextFilter
          onChange={(e) => {
            applyFilter(e);
          }}
        />
      )}
      {filterable && filterable.type === 'checkbox' && (
        <SelectFilter
          options={filterable.options}
          onChange={(e) => {
            applyFilter(e);
          }}
        />
      )}
      {filterable && filterable.type === 'clear' && (
        <div className="pr-6 text-right">
          <span
            className="text-xs text-right text-gray-500 capitalize cursor-pointer hover:text-gray-700"
            onClick={() => {
              applyFilter('clear');
            }}
          >
            Clear
          </span>
        </div>
      )}
    </td>
  );
});

Filter.defaultProps = {};

export default Filter;
