import React from "react";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export class PresenceIndicator extends React.Component {
    createInfoLine(presenceData) {
        let text = "";
        Object.values(presenceData).forEach(value => {text = value + " " + text}); //prepend to the text as we want the numbers before the description
        return "• " + text; //Material UI doesn't like bullet points...
    }

    render() {
        return (
            <div className="analytics--headerPanel" style={{marginRight: 30}}>
                <i className={`${this.props.icon} fa fa-5x analytics--headerPanelIcon`} />

                <Typography variant="h6" style={{color: this.props.color}}>{this.props.headline}</Typography>

                <div className="analytics--listContainer">
                    <List>
                        {this.props.list.map(
                            (data, index) => (
                                <ListItem dense disableGutters key={index} >
                                    <ListItemText primary={this.createInfoLine(data)} />
                                </ListItem>
                            )
                        )}
                    </List>
                </div>
            </div>
        );
    }
}
