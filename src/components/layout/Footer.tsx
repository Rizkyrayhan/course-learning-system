
const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LKP Prestasi. All rights reserved.</p>
        <p className="text-sm mt-1">Empowering Minds, One Course at a Time.</p>
      </div>
    </footer>
  );
};

export default Footer;
