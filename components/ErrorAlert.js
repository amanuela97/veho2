import React from 'react';
import { Card, CardItem, Body, Text} from 'native-base';

const ErrorAlert = (props) =>{

   

    return(
        <Card>
            <CardItem>
                <Body>                      
                    <Text>{props.alert}</Text>
                </Body>
            </CardItem>
        </Card>
    );
};

export default ErrorAlert;