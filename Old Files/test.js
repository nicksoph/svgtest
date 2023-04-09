function smoothCurve(Points) {
    const tension = 6
    const result = {};
    for (let i = 1; i < Points.length - 2; i++) {
        const p0 = Points[i - 1];
        const p1 = Points[i];
        const p2 = Points[i + 1];
        const p3 = Points[i + 2];

        Points[i].cp1.x = p1.p1.x + ((p2.p1.x - p0.p1.x) / tension);
        Points[i].cp1.y = p1.p1.y + ((p2.p1.y - p0.p1.y) / tension);
        Points[i].cp2.x = p2.p1.x - ((p3.p1.x - p1.p1.x) / tension);
        Points[i].cp2.y = p2.p1.y - ((p3.p1.y - p1.p1.y) / tension);
    }
    // Points[i]{cp1}
    var fp0 = Points[0];
    var fp1 = Points[0];
    var fp2 = Points[1];
    var fp3 = Points[2];

    Points[0].cp1.x = fp1.p1.x + ((fp2.p1.x - fp0.p1.x) / tension);
    Points[0].cp1.y = fp1.p1.y + ((fp2.p1.y - fp0.p1.y) / tension);
    Points[0].cp2.x = fp2.p1.x - ((fp3.p1.x - fp1.p1.x) / tension);
    Points[0].cp2.y = fp2.p1.y - ((fp3.p1.y - fp1.p1.y) / tension);

    fp0 = Points[Points.length - 2];
    fp1 = Points[Points.length - 2];
    fp2 = Points[Points.length - 1];
    fp3 = Points[Points.length - 1];

    Points[Points.length - 2].cp1.x = fp1.p1.x + ((fp2.p1.x - fp0.p1.x) / tension);
    Points[Points.length - 2].cp1.y = fp1.p1.y + ((fp2.p1.y - fp0.p1.y) / tension);
    Points[Points.length - 2].cp2.x = fp2.p1.x - ((fp3.p1.x - fp1.p1.x) / tension);
    Points[Points.length - 2].cp2.y = fp2.p1.y - ((fp3.p1.y - fp1.p1.y) / tension);

    Points[Points.length - 1].cp1.x = fp1.p1.x + ((fp2.p1.x - fp0.p1.x) / tension);
    Points[Points.length - 1].cp1.y = fp1.p1.y + ((fp2.p1.y - fp0.p1.y) / tension);
    Points[Points.length - 1].cp2.x = fp2.p1.x - ((fp3.p1.x - fp1.p1.x) / tension);
    Points[Points.length - 1].cp2.y = fp2.p1.y - ((fp3.p1.y - fp1.p1.y) / tension);


    return Points
}

