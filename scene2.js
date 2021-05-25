class scene2 extends Phaser.Scene{
    
    constructor ()
    {
        super("scene2");
        this.pad = null;
    }
    
    preload ()
    {   
    }
    
    create ()
    {       
        for (var i of [0, num_l-1])
        {
            map.push([]);
            for (var j of [0, num_c-1])
            {
                map[i].push(0);
            }
        }
        
    }
    
    update ()
    {
        for (var i of [0, num_l-1])
        {
            for (var j of [0, num_c-1])
            {
                if (map[i][j] == 0)
                {
                    graphics.fillStyle(0xffff00, 1);
                    graphics.fillRect(j*size_c,i*size_l,size_c,size_l);
                }
                else if (map[i][j] == 1)
                {
                    graphics.fillStyle(0xff00ff, 1);
                    graphics.fillRect(j*size_c,i*size_l,size_c,size_l);
                }
            }
        }
        
    }
}