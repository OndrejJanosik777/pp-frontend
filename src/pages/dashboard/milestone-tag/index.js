import React, { Component } from 'react';
import styled from 'styled-components';

const MilestoneTag = (props) => {
    const Tag = styled.strong`
    padding-left: ${props.pad_left}rem
    `

    return (<div>
        <Tag onClick={console.log(props)}>
            <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top!!">
                {props.milestoneItem.milestone_item_type.short_name}
                {/* test */}
            </button>
        </Tag>
    </div>);
}

export default MilestoneTag;