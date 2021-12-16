import React from 'react'
import renderer from 'react-test-renderer';
import Report from '../Report/Report';

describe('Testing', () => {
    it('Component renders correctly', () => {
        const component = renderer.create(<Report />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
