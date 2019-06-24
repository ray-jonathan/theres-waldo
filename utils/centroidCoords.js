// if we want to center the map on all the users on your team, see this SO link
// https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript

// where pts =  [{x:78.0001462, y: 40.0008827},{x:78.0001462, y: 40.0008827}, etc]

export default function centroidCoords(pts) {
    var first = pts[0], last = pts[pts.length-1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    var twicearea=0,
    x=0, y=0,
    nPts = pts.length,
    p1, p2, f;
    for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
      p1 = pts[i]; p2 = pts[j];
      f = (p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x);
      twicearea += f;
      x += (p1.x + p2.x - 2 * first.x) * f;
      y += (p1.y + p2.y - 2 * first.y) * f;
    }
    f = twicearea * 3;
    return { x:x/f + first.x, y:y/f + first.y };
}


