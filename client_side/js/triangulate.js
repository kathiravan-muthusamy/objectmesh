function triangulate_unity(xA,yA,rA1,rA2,rA3,
                           xB,yB,rB1,rB2,rB3,
                           xC,yC,rC1,rC2,rC3)
{
   beacon = [];
   beacon.push(triangulate(xA,yA,rA1,xB,yB,rB1,xC,yC,rC1,1));
   beacon.push(triangulate(xA,yA,rA2,xB,yB,rB2,xC,yC,rC2,1));
   beacon.push(triangulate(xA,yA,rA3,xB,yB,rB3,xC,yC,rC3,1));

   return beacon;
}

function triangulate(xA,yA,rA,xB,yB,rB,xC,yC,rC,count) {

      pred = [];

      count = count || 1;

      if (count == 4)
      {
        pred={'x':1000,'y':1000};
        return pred;
      }

      // console.log(xA,yA,rA,xB,yB,rB,xC,yC,rC);

      d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
      K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

      if (rA+rB < d)
      {
        // console.log("dont meet");
        count = count + 1;
        pred = triangulate(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
      }
      else if(d < Math.abs(rA-rB))
      {
        // console.log("inside");
        count = count + 1;
        pred = triangulate(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
      }
      else
      {
        x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
        y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

        x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
        y2  = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);


        if (xC && yC && rC)
        {
          d31 = Math.sqrt((xC-x1)*(xC-x1)+(yC-y1)*(yC-y1));
          d32 = Math.sqrt((xC-x2)*(xC-x2)+(yC-y2)*(yC-y2));
          if (Math.abs(d31-rC) < Math.abs(d32-rC))
          {
            pred={'x':x1,'y':y1};
          }
          else {
            pred={'x':x2,'y':y2};
          }
        }
        else {
          pred={'x':x1,'y':y1};
          pred={'x':x2,'y':y2};
        }
      }
    return pred;
}
