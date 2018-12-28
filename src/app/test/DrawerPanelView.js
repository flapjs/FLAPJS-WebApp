import React from 'react';

class DrawerPanelView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
      className={this.props.className}
      style={this.props.style}>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at mi a magna posuere congue quis in lorem. Ut ornare nulla tempus, finibus velit eu, finibus odio. Etiam et felis diam. Phasellus convallis non justo non posuere. Duis facilisis felis ut sapien posuere tincidunt. Donec a neque nec nisi dignissim semper. Integer egestas tincidunt mauris eu molestie. Aliquam vitae consequat lacus. Maecenas sollicitudin tristique dolor. Curabitur consequat, justo semper accumsan ultrices, est nunc cursus eros, a egestas sapien quam vitae magna. Vivamus id ante mauris.

        Duis et ipsum at metus bibendum pretium. Nam maximus justo id consectetur eleifend. Pellentesque pretium sapien at porta aliquet. Duis nec magna eleifend, vulputate est at, blandit nulla. Praesent et condimentum diam, nec ultrices eros. Nunc pharetra id ex ac efficitur. Donec porttitor odio nec purus tincidunt euismod. Integer congue nec diam eu viverra.

        Duis vel dignissim orci, id laoreet tellus. Duis faucibus quam vitae ligula maximus egestas. Ut sed tellus et metus lobortis volutpat. Donec vitae ultrices sapien, sit amet imperdiet orci. Morbi vulputate rutrum nisi, vel ornare nunc sodales sit amet. Suspendisse ultricies nec augue eu ullamcorper. Aliquam ante massa, feugiat nec turpis vitae, sagittis finibus nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed sit amet odio vehicula, cursus neque eget, molestie risus. Vivamus faucibus massa ac tincidunt sagittis. Maecenas auctor odio eu lobortis bibendum. Phasellus mollis congue neque et sollicitudin. Mauris vestibulum sit amet est ac feugiat. Ut mattis in quam at suscipit. Quisque feugiat ornare convallis.

        In ut dolor id quam pretium luctus sed eu orci. Morbi vitae eros volutpat, tempor ex id, vestibulum est. Aliquam nec pulvinar eros. Pellentesque maximus, sapien id sagittis aliquet, turpis magna efficitur arcu, vel rhoncus dui arcu in augue. Aenean in sapien in orci faucibus eleifend eget tristique nulla. Sed varius varius libero. Sed sagittis felis lectus, ultrices tincidunt odio placerat nec.

        Proin nec ante varius, tristique enim id, mollis mauris. Donec condimentum, lectus ut ultricies vulputate, lectus sapien euismod orci, et interdum turpis erat sed libero. Pellentesque imperdiet, nunc a egestas luctus, ipsum erat pharetra leo, id cursus sem mi ac augue. Nulla feugiat velit tellus, ac efficitur velit pellentesque eleifend. Donec consequat porta maximus. Cras nec tellus tincidunt, venenatis orci et, blandit odio. Proin finibus mauris eu malesuada facilisis. Suspendisse potenti. Pellentesque ut sapien sit amet quam hendrerit imperdiet vitae vitae arcu. Vestibulum fringilla euismod quam ac tempor.
        </p>
        {this.props.children}
      </div>
    );
  }
}

export default DrawerPanelView;
