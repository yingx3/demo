##plot 5: OOA detection supplementary material

#remove title and annotations
g1 <- g1 + theme(plot.title=element_blank(),
                 axis.title.x=element_blank(),
                 axis.text.x=element_blank(),
                 axis.ticks.x=element_blank())
g2 <- g2 + theme(plot.title=element_blank(),
                 axis.title.x=element_blank(),
                 axis.text.x=element_blank(),
                 axis.ticks.x=element_blank())
g3 <- g3 + theme(plot.title=element_blank())

#combine plots g1 + g2 + g3 +g4
g4 <- ggarrange(g1, g2, g3 + geom_vline(xintercept = as.numeric(OOA), col ="darkgreen", size=0.5, lty = 2),
                            nrow = 3, ncol = 1, align = "v", heights = c(1,1,1),
                            common.legend = TRUE, legend = "bottom")

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
print(g4)
ggsave(paste0("1e_OOAsuppl_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
       width = 20, height = 20, units = "cm")
}
